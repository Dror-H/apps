import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { AdSetRepository } from '@api/ad-set/data/ad-set.repository';
import { Ad } from '@api/ad/data/ad.entity';
import { AdRepository } from '@api/ad/data/ad.repository';
import { CampaignRepository } from '@api/campaign/data/campaign.repository';
import { AdDTO, QueueNames, QueueProcessNames, SupportedProviders } from '@instigo-app/data-transfer-object';
import { ThirdPartyAdApiService } from '@instigo-app/third-party-connector';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { isEmpty, isUndefined } from 'lodash';
import { In, Not } from 'typeorm';

@Injectable()
@Processor(QueueNames.ADS)
export class AdScrapperService {
  private readonly logger = new Logger(AdScrapperService.name);

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(ThirdPartyAdApiService)
  private readonly thirdPartyAdApiService: ThirdPartyAdApiService;

  @Inject(CampaignRepository)
  private readonly campaignRepository: CampaignRepository;

  @Inject(AdSetRepository)
  private readonly adSetRepository: AdSetRepository;

  @Inject(AdRepository)
  private readonly adRepository: AdRepository;

  @Process(QueueProcessNames.FETCH_ADS)
  async fetchAds(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const { provider } = adAccount;
      const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
      const adsDto: AdDTO[] = await this.thirdPartyAdApiService.findAll({
        provider,
        accessToken,
        adAccountProviderId: adAccount.providerId,
      });
      const campaigns = await this.campaignRepository.find({ adAccount });
      const adSets = await this.adSetRepository.find({ adAccount });
      const ads = adsDto?.map((adDto: AdDTO) => {
        const adSet = adSets.find((adSet) => adSet.providerId === adDto.adSetId);
        return {
          provider: adDto.provider,
          providerId: adDto.providerId,
          name: adDto.name,
          status: adDto.status,
          effectiveStatus: adDto.effectiveStatus,
          objectStoryId: adDto.objectStoryId,
          objectStorySpec: adDto.objectStorySpec,
          instagramPermalink: adDto.instagramPermalink,
          thumbnailUrl: adDto.thumbnailUrl,
          linkedinType: adDto.linkedinType,
          createdAt: adDto.createdAt,
          updatedAt: adDto.updatedAt,
          campaign: campaigns.find((campaign) => campaign.providerId === adDto.campaignId),
          actionTypeField: adSet?.actionTypeField,
          adSet,
          adAccount,
        } as Ad;
      });

      await this.syncAds(provider, adAccount, ads);
      if (isEmpty(ads)) {
        this.logger.log(`Job ${job.id} of type ${job.name} has successfully fetched 0 ads`);
        return `0 ads successfully fetched`;
      }
      const createdAds = await TypeOrmUpsert(this.adRepository, ads, 'providerId', {
        doNotUpsert: ['provider', 'providerId', 'adAccount', 'campaign', 'adSet'],
      });
      this.logger.log(`Job ${job.id} of type ${job.name} has successfully fetched
                ${createdAds.length} ads`);
      return `${createdAds.length} ads successfully fetched`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async syncAds(provider: SupportedProviders, adAccount: AdAccount, ads: Ad[] = []): Promise<void> {
    const providerIds = ads.map(({ providerId }) => providerId).filter((providerId) => !isUndefined(providerId));
    if (providerIds.length > 0) {
      await this.adRepository.delete({ adAccount, provider, providerId: Not(In(providerIds)) });
    }
  }
}
