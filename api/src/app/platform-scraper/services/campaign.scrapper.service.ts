import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { CampaignGroupRepository } from '@api/campaign-group/data/campaign-group.repository';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { CampaignRepository } from '@api/campaign/data/campaign.repository';
import {
  CampaignDTO,
  CampaignGroupDTO,
  QueueNames,
  QueueProcessNames,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyCampaignApiService, ThirdPartyCampaignGroupApiService } from '@instigo-app/third-party-connector';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { isEmpty, isUndefined } from 'lodash';
import { In, Not } from 'typeorm';

@Injectable()
@Processor(QueueNames.CAMPAIGNS)
export class CampaignScrapperService {
  private readonly logger = new Logger(CampaignScrapperService.name);

  @Inject(ThirdPartyCampaignApiService)
  private readonly thirdPartyCampaignApiService: ThirdPartyCampaignApiService;

  @Inject(ThirdPartyCampaignGroupApiService)
  private readonly thirdPartyGroupCampaignApiService: ThirdPartyCampaignGroupApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(CampaignRepository)
  private readonly campaignRepository: CampaignRepository;

  @Inject(CampaignGroupRepository)
  private readonly campaignGroupRepository: CampaignGroupRepository;

  constructor(@InjectQueue(QueueNames.ADSETS) private readonly adSetsQueue: Queue) {}

  @Process(QueueProcessNames.FETCH_CAMPAIGNS)
  async fetchCampaigns(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const { provider } = adAccount;
      const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
      await this.fetchAndSaveLinkedInCampaignGroups({ adAccount, accessToken });

      const campaigns = (
        await this.thirdPartyCampaignApiService.findAll({
          provider,
          accessToken,
          adAccountProviderId: adAccount.providerId,
        })
      ).map((campaign: CampaignDTO) => ({
        adAccount: adAccount.id,
        campaignGroup: { providerId: campaign.campaignGroupId },
        ...campaign,
      }));

      await this.syncCampaigns(provider, adAccount, campaigns as CampaignDTO[]);
      if (isEmpty(campaigns)) {
        return `0 Campaigns successfully fetched`;
      }
      const created = (await TypeOrmUpsert<Campaign[]>(this.campaignRepository, campaigns as any, 'providerId', {
        doNotUpsert: ['provider', 'providerId', 'adAccount', 'campaignGroup', 'campaignGroupId'],
      })) as Campaign[];

      return `${created.length} Campaigns successfully fetched`;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async fetchAndSaveLinkedInCampaignGroups({ adAccount, accessToken }): Promise<void> {
    const provider = adAccount.provider;
    if (provider === SupportedProviders.LINKEDIN) {
      const campaignGroups = (
        await this.thirdPartyGroupCampaignApiService.findAll({
          provider,
          accessToken,
          adAccountProviderId: adAccount.providerId,
        })
      ).map((campaignGroup: CampaignGroupDTO) => ({ adAccount: adAccount, ...campaignGroup }));

      await this.syncCampaignGroups(provider, adAccount, campaignGroups as CampaignGroupDTO[]);
      const createdGroups = await this.campaignGroupRepository.save(campaignGroups as any[]);
      this.logger.log(`${createdGroups.length} campaign groups successfully fetched and saved`);
    }
  }

  private async syncCampaigns(
    provider: SupportedProviders,
    adAccount: AdAccount,
    campaigns: CampaignDTO[] = [],
  ): Promise<void> {
    const providerIds = campaigns.map(({ providerId }) => providerId).filter((providerId) => !isUndefined(providerId));
    if (providerIds.length > 0) {
      await this.campaignRepository.delete({ adAccount, provider, providerId: Not(In(providerIds)) });
    }
  }

  private async syncCampaignGroups(
    provider: SupportedProviders,
    adAccount: AdAccount,
    campaignGroups: CampaignGroupDTO[] = [],
  ): Promise<void> {
    const providerIds = campaignGroups
      .map(({ providerId }) => providerId)
      .filter((providerId) => !isUndefined(providerId));
    if (providerIds.length > 0) {
      await this.campaignGroupRepository.delete({ adAccount, provider, providerId: Not(In(providerIds)) });
    }
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_CAMPAIGNS })
  onCompleted(job: Job) {
    return this.startFetchingAdSets(job);
  }

  startFetchingAdSets(job: Job<{ adAccount: AdAccount }>) {
    const { data } = job;
    const { adAccount } = data;
    return this.adSetsQueue.add(QueueProcessNames.FETCH_ADSETS, { adAccount });
  }
}
