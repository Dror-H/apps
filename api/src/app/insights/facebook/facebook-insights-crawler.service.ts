import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { Ad } from '@api/ad/data/ad.entity';
import { CronicleProgress, rows, sleep } from '@instigo-app/api-shared';
import { FacebookBreakdownType, SupportedProviders, TimeRange } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { differenceInHours, millisecondsToMinutes } from 'date-fns';
import { chunk, isEmpty } from 'lodash';
import { Repository } from 'typeorm';
import { FacebookInsightsEntity } from '../data/facebook-insights.entity';
import { InsightsAuditEntity, StatusType } from '../data/insights-audit.entity';
import { breakdownTypes, buildCombinations, FacebookCombination } from './constants';
import { FacebookApiService } from './facebook-api.service';
import { marshalInsights } from './map-facebook-metrics';
import { FacebookMetrics } from './model.facebook';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class FacebookInsightsCrawlerService {
  private readonly logger = new Logger(FacebookInsightsCrawlerService.name);

  @Inject(FacebookApiService)
  private readonly facebookApiService: FacebookApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @InjectRepository(InsightsAuditEntity)
  private readonly insightsAuditRepository: Repository<InsightsAuditEntity>;

  @InjectRepository(FacebookInsightsEntity)
  private readonly facebookInsightsRepository: Repository<FacebookInsightsEntity>;

  @InjectRepository(Ad)
  private readonly adRepository: Repository<Ad>;

  async sync(options: { cronicleJob: { id: string } }): Promise<void> {
    const { cronicleJob } = options;
    const adAccounts = await this.adAccountRepository.find({ where: { provider: SupportedProviders.FACEBOOK } });
    const progressBar = new CronicleProgress({ total: adAccounts.length, job: cronicleJob });
    this.logger.log(`sync ${adAccounts.length} adaccounts`, 'sync-ad-accounts');
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

      for await (const ad of rows<Ad>({
        repository: this.adRepository,
        where: { adAccount },
        offset: audit.status === StatusType.IN_PROGRESS ? audit?.details?.index : 0,
      })) {
        const statTime = audit?.done ? audit?.done : ad?.createdAt;
        await this.syncEntity({
          accessToken: token.accessToken,
          adAccountId: adAccount.providerId,
          adId: ad.providerId,
          timeRange: {
            start: statTime,
            end: new Date(),
          },
        });
        await this.insightsAuditRepository.save({
          ...audit,
          status: StatusType.IN_PROGRESS,
          done: new Date(),
          details: { index: ad.index },
          progress: Number(ad.progress.toFixed()),
        });
        progressBar.tick();
      }
      await this.insightsAuditRepository.save({
        ...audit,
        status: StatusType.DONE,
        done: new Date(),
        details: null,
        progress: 0,
      });
      await progressBar.finishJob({
        job: cronicleJob,
      });
    }
  }

  async syncEntity(options: { accessToken: string; adAccountId: string; adId?: string; timeRange: TimeRange }) {
    const { accessToken, adAccountId, adId, timeRange } = options;
    const t0 = new Date();
    const combinations = buildCombinations(timeRange);
    const { results, errors } = await new PromisePool()
      .for(combinations)
      .process(async (options: FacebookCombination) => {
        const { breakdown, timeRange } = options;
        const [err, insights] = await to(
          this.facebookApiService.getInsights({
            accessToken: accessToken,
            accountId: adAccountId,
            providerId: adId,
            timeRange,
            breakdown: breakdownTypes[breakdown],
          }),
        );
        if (err) {
          this.logger.error(err, 'sync-entity');
          throw err;
        }
        const minutes = millisecondsToMinutes(new Date().getTime() - t0.getTime());
        const mapped: Partial<FacebookInsightsEntity>[] = this.mapInsights({ insights, breakdown });
        if (!isEmpty(mapped)) {
          const saved = await this.saveInsights({ insights: mapped });
          return { insights: saved?.total, elapsed: minutes };
        }
        await sleep(500);
        return { insights: 0, elapsed: minutes };
      });
    if (errors.length > 0) {
      this.logger.error(errors, 'sync-entity-error');
    }
    return { results, errors };
  }

  private mapInsights(options: {
    insights: FacebookMetrics[];
    breakdown: FacebookBreakdownType;
  }): Partial<FacebookInsightsEntity>[] {
    const { insights, breakdown } = options;
    if (insights.length === 0) {
      return [];
    }
    return insights.map((data: FacebookMetrics) => marshalInsights(breakdown, data));
  }

  private async saveInsights(options: { insights: any[] }) {
    const { insights } = options;
    let total = 0;
    for (const chunkInsights of chunk(insights, 500)) {
      const [error, saved] = await to(
        this.facebookInsightsRepository
          .createQueryBuilder()
          .insert()
          .values(chunkInsights)
          .orUpdate({
            conflict_target: ['id'],
            overwrite: [
              'actions',
              'action_values',
              'attribution_setting',
              'buying_type',
              'canvas_avg_view_percent',
              'canvas_avg_view_time',
              'catalog_segment_value',
              'clicks',
              'conversion_rate_ranking',
              'conversions',
              'conversion_values',
              'converted_product_quantity',
              'converted_product_value',
              'cost_per_action_type',
              'cost_per_thruplay',
              'cost_per_unique_action_type',
              'cost_per_conversion',
              'cost_per_unique_click',
              'cost_per_unique_inline_link_click',
              'cost_per_unique_outbound_click',
              'engagement_rate_ranking',
              'estimated_ad_recallers',
              'estimated_ad_recall_rate',
              'frequency',
              'full_view_impressions',
              'full_view_reach',
              'impressions',
              'inline_link_clicks',
              'inline_post_engagement',
              'instant_experience_clicks_to_open',
              'instant_experience_clicks_to_start',
              'instant_experience_outbound_clicks',
              'mobile_app_purchase_roas',
              'objective',
              'optimization_goal',
              'outbound_clicks',
              'place_page_name',
              'purchase_roas',
              'qualifying_question_qualify_answer_rate',
              'quality_ranking',
              'reach',
              'social_spend',
              'spend',
              'unique_clicks',
              'video30_sec_watched_actions',
              'video_avg_time_watched_actions',
              'video_p100_watched_actions',
              'video_p25_watched_actions',
              'video_p50_watched_actions',
              'video_p75_watched_actions',
              'video_p95_watched_actions',
              'video_play_actions',
              'video_play_curve_actions',
              'website_ctr',
              'website_purchase_roas',
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
