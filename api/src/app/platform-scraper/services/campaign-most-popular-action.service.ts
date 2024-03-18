import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdSet } from '@api/ad-set/data/ad-set.entity';
import { AdSetRepository } from '@api/ad-set/data/ad-set.repository';
import { CampaignRepository } from '@api/campaign/data/campaign.repository';
import { getConversionAction } from '@api/shared/conversion-action-field';
import { QueueNames, QueueProcessNames } from '@instigo-app/data-transfer-object';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Injectable()
@Processor(QueueNames.SET_ACTION_TYPE_FILED)
export class CampaignMostPopularActionScrapperService {
  private readonly logger = new Logger(CampaignMostPopularActionScrapperService.name);

  @Inject(CampaignRepository)
  private readonly campaignRepository: CampaignRepository;

  @Inject(AdSetRepository)
  private readonly adSetRepository: AdSetRepository;

  constructor(@InjectQueue(QueueNames.ADSETS) private readonly adSetsQueue: Queue) {}

  @Process(QueueProcessNames.AD_MOST_POPULAR_ACTION_ON_CAMPAIGN)
  async adMostPopularActionOnCampaigns(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const campaigns = await this.campaignRepository.find({ adAccount });
      for (const campaign of campaigns) {
        const adSets = await this.adSetRepository.find({ campaign });
        if (adSets.length > 0) {
          // Check if all returned optimization_goals are equal and if not, set the first one as the optimization goal
          const selectedOptimization = adSets.every((val) => val.optimizationGoal === adSets[0].optimizationGoal)
            ? adSets[0].optimizationGoal
            : this.mostOccurringField(adSets, 'optimizationGoal');
          // Select the most occurring value from promotedObject if exists
          let isPixel = false;
          const promObjectValues = adSets.reduce((acc: any, cur: AdSet) => {
            if (cur.promotedObject) {
              Object.entries(cur?.promotedObject).forEach(([key, val]) => {
                if (key !== 'pixel_id') {
                  if (isNaN(val as any)) {
                    acc.push(val);
                  }
                } else {
                  isPixel = true;
                }
              });
            }
            return acc;
          }, []);
          const selectedPromObjectValue =
            promObjectValues.length > 0 ? this.mostOccurringElement(promObjectValues) : null;
          campaign.actionTypeField = getConversionAction(
            campaign.objective,
            selectedOptimization,
            selectedPromObjectValue,
            isPixel,
          );
        }
      }
      const created = await TypeOrmUpsert(this.campaignRepository, campaigns, 'providerId', {
        doNotUpsert: ['provider', 'providerId', 'adAccount'],
      });
      return `${created.length} campaigns successfully updated`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  // If optimization_goals dont match, get the most occuring one
  mostOccurringField(elementsArray: AdSet[], field: string) {
    return elementsArray
      .sort(
        (a, b) =>
          elementsArray.filter((v) => v[field] === a[field]).length -
          elementsArray.filter((v) => v[field] === b[field]).length,
      )
      .pop()[field];
  }

  mostOccurringElement(elementsArray) {
    return elementsArray
      .sort((a, b) => elementsArray.filter((v) => v === a).length - elementsArray.filter((v) => v === b).length)
      .pop();
  }
}
