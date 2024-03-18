import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { AdSet } from '@api/ad-set/data/ad-set.entity';
import { AdSetRepository } from '@api/ad-set/data/ad-set.repository';
import { CampaignRepository } from '@api/campaign/data/campaign.repository';
import { getConversionAction } from '@api/shared/conversion-action-field';
import {
  AdSetDTO,
  CampaignDTO,
  QueueNames,
  QueueProcessNames,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAdSetApiService } from '@instigo-app/third-party-connector';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { isEmpty, isUndefined } from 'lodash';
import { In, Not } from 'typeorm';

@Injectable()
@Processor(QueueNames.ADSETS)
export class AdSetScrapperService {
  private readonly logger = new Logger(AdSetScrapperService.name);

  @Inject(ThirdPartyAdSetApiService)
  private readonly thirdPartyAdSetApiService: ThirdPartyAdSetApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(CampaignRepository)
  private readonly campaignRepository: CampaignRepository;

  @Inject(AdSetRepository)
  private readonly adSetRepository: AdSetRepository;

  constructor(
    @InjectQueue(QueueNames.ADS) private readonly adsQueue: Queue,
    @InjectQueue(QueueNames.SET_ACTION_TYPE_FILED)
    private readonly actionsOnCampaign: Queue,
  ) {}

  @Process(QueueProcessNames.FETCH_ADSETS)
  async fetchAdSets(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const { provider } = adAccount;
      const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
      const adSetsDto = await this.thirdPartyAdSetApiService.findAll({
        provider,
        accessToken,
        adAccountProviderId: adAccount.providerId,
      });
      const campaigns = await this.campaignRepository.find({ adAccount });
      const adSets = adSetsDto?.map((adSet: AdSetDTO) => {
        const campaign = campaigns.find((campaign) => campaign.providerId === adSet.campaignId);
        const actionTypeField = this.getActionTypeField(campaign, adSet);
        return {
          providerId: adSet.providerId,
          name: adSet.name,
          budget: adSet.budget,
          budgetType: adSet.budgetType,
          provider: adSet.provider,
          status: adSet.status,
          bidStrategy: adSet.bidStrategy,
          createdAt: adSet.createdAt,
          updatedAt: adSet.updatedAt,
          startTime: campaign.startTime,
          endTime: adSet.endTime,
          optimizationGoal: adSet.optimizationGoal,
          promotedObject: adSet.promotedObject,
          dayParting: adSet.dayParting,
          billingEvent: adSet.billingEvent,
          budgetRemaining: adSet.budgetRemaining,
          adSetSchedule: adSet.adSetSchedule,
          actionTypeField,
          campaign,
          adAccount,
        } as AdSet;
      });

      await this.syncAdSets(provider, adAccount, adSets);
      if (isEmpty(adSets)) {
        this.logger.log(`Job ${job.id} of type ${job.name} has successfully fetched 0 adSets`);
        return `0 adSets successfully fetched`;
      }

      const createdAdSets = await TypeOrmUpsert(this.adSetRepository, adSets, 'providerId', {
        doNotUpsert: ['provider', 'providerId', 'adAccount', 'campaign'],
      });
      this.logger.log(`Job ${job.id} of type ${job.name} has successfully fetched
                ${createdAdSets.length} adSets`);
      return `${createdAdSets.length} adSets successfully fetched`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async syncAdSets(provider: SupportedProviders, adAccount: AdAccount, adSets: AdSet[] = []): Promise<void> {
    const providerIds = adSets.map(({ providerId }) => providerId).filter((providerId) => !isUndefined(providerId));
    if (providerIds.length > 0) {
      await this.adSetRepository.delete({ adAccount, provider, providerId: Not(In(providerIds)) });
    }
  }

  private getActionTypeField(campaign: CampaignDTO, adSet: AdSetDTO): string {
    const isPixel = adSet?.promotedObject?.pixel_id ? true : false;
    const promObjectValue = adSet?.promotedObject?.custom_event_type ? adSet.promotedObject.custom_event_type : '';
    return getConversionAction(campaign.objective, adSet.optimizationGoal, promObjectValue, isPixel);
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_ADSETS })
  onCompleted(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`);
    this.startFetchingAds(job);
    this.startAddingActionType(job);
  }

  private startFetchingAds(job: Job) {
    const { data } = job;
    const { adAccount } = data;
    void this.adsQueue.add(QueueProcessNames.FETCH_ADS, { adAccount });
  }

  private startAddingActionType(job: Job) {
    const { data } = job;
    const { adAccount } = data;
    void this.actionsOnCampaign.add(QueueProcessNames.AD_MOST_POPULAR_ACTION_ON_CAMPAIGN, { adAccount });
  }
}
