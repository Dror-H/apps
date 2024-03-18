import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { Ad } from '@api/ad/data/ad.entity';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { CronicleProgress, ProgressBar, rows } from '@instigo-app/api-shared';
import { SupportedProviders, TimeRange } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { differenceInHours } from 'date-fns';
import { chunk, flatten } from 'lodash';
import { Repository } from 'typeorm';
import { InsightsAuditEntity, StatusType } from '../data/insights-audit.entity';
import { LinkedinInsightsEntity } from '../data/linkedin-insights.entity';
import { LinkedinApiService } from './linkedin-api.service';
import { buildCombinations, mapElements } from './linkedin-insights-helper';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class LinkedinInsightsCrawlerService {
  private readonly logger = new Logger(LinkedinInsightsCrawlerService.name);

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @InjectRepository(Campaign)
  private readonly campaignRepository: Repository<Campaign>;

  @InjectRepository(Ad)
  private readonly adRepository: Repository<Ad>;

  @InjectRepository(LinkedinInsightsEntity)
  private readonly linkedinInsightsRepository: Repository<LinkedinInsightsEntity>;

  @InjectRepository(InsightsAuditEntity)
  private readonly insightsAuditRepository: Repository<InsightsAuditEntity>;

  @Inject(LinkedinApiService)
  private readonly linkedinApiService: LinkedinApiService;

  async syncAdAccounts(options: { cronicleJob: { id: string } }): Promise<void> {
    try {
      const { cronicleJob } = options;
      const adAccounts = await this.adAccountRepository.find({ where: { provider: SupportedProviders.LINKEDIN } });
      const progressBar = new CronicleProgress({ total: adAccounts.length, job: cronicleJob });
      for (const adAccount of adAccounts) {
        const [tokenError, token] = await to(
          this.adAccountRepository.getAccessTokenByProviderId({ providerId: adAccount.providerId }),
        );

        if (tokenError) {
          continue;
        }

        let audit = await this.insightsAuditRepository.findOne({
          where: { adAccountId: adAccount.providerId },
          order: { updatedAt: 'DESC' },
        });

        if (differenceInHours(new Date(), audit?.done) < 1 && audit.status !== StatusType.IN_PROGRESS) {
          continue;
        }

        audit = {
          ...audit,
          adAccountId: adAccount.providerId,
          provider: adAccount.provider,
          start: new Date(),
        };

        for await (const campaign of rows<Campaign>({
          repository: this.campaignRepository,
          where: { adAccount },
          offset: audit.status === StatusType.IN_PROGRESS ? audit?.details?.index : 0,
        })) {
          const ads = await this.adRepository.find({ where: { campaign } });
          await new PromisePool().for(ads).process(async (ad) => {
            const startTimeForAds = audit?.done ? audit?.done : ad?.createdAt;
            await this.syncEntity({
              accessToken: token.accessToken,
              adAccountId: Number(adAccount.providerId),
              campaignId: Number(campaign.providerId),
              adId: Number(ad.providerId),
              timeRange: {
                start: startTimeForAds,
                end: new Date(),
              },
            });
          });
          await this.insightsAuditRepository.save({
            ...audit,
            status: StatusType.IN_PROGRESS,
            done: new Date(),
            details: { index: campaign.index },
            progress: Number(campaign.progress.toFixed()),
          });
        }

        await this.insightsAuditRepository.save({
          ...audit,
          status: StatusType.DONE,
          done: new Date(),
          details: null,
          progress: 0,
        });
        progressBar.tick();
      }
      await progressBar.finishJob({
        job: cronicleJob,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async syncEntity(options: {
    accessToken: string;
    adAccountId: number;
    campaignId: number;
    adId?: number;
    timeRange: TimeRange;
  }) {
    const { accessToken, adAccountId, campaignId, adId, timeRange } = options;
    const combinations = buildCombinations(timeRange);
    const progressBar = new ProgressBar({ identifier: (adId || campaignId).toString(), total: combinations.length });
    const { results } = await new PromisePool<LinkedinInsightsEntity[]>()
      .for(combinations)
      .withConcurrency(5)
      .process(async (combination) => {
        const { breakdown, timeRange } = combination;
        const [err, elements] = await to(
          this.linkedinApiService.insights({
            accessToken,
            id: adId.toString(),
            breakdown,
            timeRange,
          }),
        );
        progressBar.tick();
        if (err) {
          this.logger.error(err);
        }
        const insights = mapElements({ elements: elements, adAccountId, campaignId, adId, breakdown });
        return insights;
      });
    return await this.saveInsights({ insights: flatten(results) });
  }

  async saveInsights(options: { insights: LinkedinInsightsEntity[] }) {
    const { insights } = options;
    let total = 0;
    if (insights.length == 0) {
      return { total };
    }
    for (const chunkInsights of chunk(insights, 500)) {
      const [error, saved] = await to(
        this.linkedinInsightsRepository
          .createQueryBuilder()
          .insert()
          .values(chunkInsights)
          .orUpdate({
            conflict_target: ['id'],
            overwrite: [
              'spend',
              'impressions',
              'reach',
              'clicks',
              'frequency',
              'conversions',
              'conversions_rate',
              'total_engagements',
              'other_engagements',
              'likes',
              'comments',
              'shares',
              'follows',
            ],
          })
          .execute(),
      );
      if (error) {
        this.logger.error(error);
      }
      total = total + Number(saved?.raw?.length);
    }
    return { total };
  }
}
