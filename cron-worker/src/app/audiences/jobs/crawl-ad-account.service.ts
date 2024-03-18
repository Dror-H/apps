/* eslint-disable max-lines */
import { pMap, ProgressBar, sleep, TargetingHelperService, trycatch } from '@instigo-app/api-shared';
import { FacebookTargeting, SupportedProviders, TokenStatus } from '@instigo-app/data-transfer-object';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FacebookTarget } from '@prisma/client';
import PromisePool from '@supercharge/promise-pool';
import to from 'await-to-js';
import { AxiosResponse } from 'axios';
import { format, subMonths } from 'date-fns';
import { isEmpty } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { catchError, expand, map, reduce } from 'rxjs/operators';
import { sql } from 'slonik';
import { DatabaseService } from '../../database/db.service';
import { AdAccountRepository } from '../services/ad-account.repository';
type Rates = { [key: string]: number };
interface TargetingMetrics {
  ad_set_id: string;
  spend: number;
  impressions: number;
  social_spend: number;
  reach: number;
  clicks: number;
  unique_clicks: number;
  inline_link_clicks: number;
  inline_post_engagement: number;
  unique_ctr: number;
  instant_experience_clicks_to_open: number;
  instant_experience_clicks_to_start: number;
  cpm: number;
  cpc: number;
  cpp: number;
  ctr: number;
  quality_ranking: string;
  frequency: number;
  cost_per_inline_link_click: number;
  cost_per_inline_post_engagement: number;
  cost_per_unique_click: number;
  cost_per_unique_inline_link_click: number;
  engagement_rate_ranking: string;
  inline_link_click_ctr: number;
}
@Injectable()
export class CrawlAdAccountService {
  @Inject(TargetingHelperService)
  private readonly targetingHelperService: TargetingHelperService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(ThirdPartyAuthApiService)
  private readonly thirdPartyAuthApiService: ThirdPartyAuthApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  private readonly logger = new Logger(CrawlAdAccountService.name);

  rates: Rates = null;

  @Cron(CronExpression.EVERY_DAY_AT_2AM, { name: 'crawl-ad-accounts' })
  async syncAllAdAccounts(): Promise<void> {
    const accounts = await this.adAccountRepository.getAllAccountsWithToken();
    this.logger.log(`Found ${accounts.length} accounts`);
    await this.crawlAccounts(accounts);
  }

  async crawlAccounts(accounts: { id: string; access_token: string }[]): Promise<void> {
    const [, rates] = await to(this.getExchangeRates());
    this.rates = rates;

    const progress = new ProgressBar({ total: accounts.length, identifier: 'crawling-accounts' });
    this.logger.log(`Found ${accounts.length} accounts to crawl`);

    // eslint-disable-next-line max-statements
    await new PromisePool().for(accounts).process(async (account) => {
      const [statusErr, status] = await to(
        this.thirdPartyAuthApiService.inspectToken({
          provider: SupportedProviders.FACEBOOK,
          accessToken: account.access_token,
        }),
      );
      await sleep(1000);
      if (status.status === TokenStatus.EXPIRED || statusErr) {
        return;
      }

      const [fetchAdSetsErr, adsets] = await to(this.getAdSets({ account }));
      await sleep(1000);

      if (!adsets || adsets?.length === 0 || fetchAdSetsErr) {
        this.logger.error(`No adsets found for account ${account.id}`);
        return;
      }
      await to(this.findAndSaveInsights(adsets, account));
      const { results: specs, errors } = await new PromisePool()
        .for(adsets)
        .withConcurrency(5)
        .process<any>(
          async (adset: { id: string }) =>
            await this.getTargetingFromFacebook({
              id: adset.id,
              access_token: account.access_token,
            }),
        );

      if (!specs || specs?.length === 0) {
        if (errors.length) {
          for (const err of errors) {
            this.logger.error(err);
          }
        }
        this.logger.error(`Specs not found for account ${account.id}`);
        return;
      }

      this.logger.log(`Found ${specs.length} specs for account ${account.id}`);
      const toBeInserted = specs
        .map((spec) => {
          const [, result] = trycatch(() => this.targetingHelperService.mapFacebookSpecToDBInsert({ spec }) as any);
          return result as Partial<FacebookTarget>;
        })
        .filter((spec) => spec);

      if (toBeInserted.length === 0) {
        return;
      }

      const values = sql.join(
        toBeInserted.map(
          (row) =>
            sql`(${row.id},${JSON.stringify(row.spec)},${JSON.stringify(row.segments)},${JSON.stringify(row.topics)})`,
        ),
        sql`,`,
      );

      const insert = sql`
      INSERT INTO facebook_targetings (id, spec, segments, topics) VALUES ${values}
      ON CONFLICT (id) DO UPDATE SET (id, spec, segments, topics) = (EXCLUDED.id, EXCLUDED.spec, EXCLUDED.segments, EXCLUDED.topics)
      RETURNING id
     `;

      const [specSaveErr, insertedCount] = await to(this.databaseService.audiences.query(insert));

      if (specSaveErr) {
        this.logger.error(specSaveErr);
      }

      if (insertedCount) {
        this.logger.log(`Saved ${insertedCount.rowCount} specs for account ${account.id}`);
      }

      await sleep(100);
      progress.tick();
    });
  }

  private async findAndSaveInsights(
    adsets: { id: string }[],
    account: { id: string; access_token: string },
  ): Promise<void> {
    const insights = await pMap<TargetingMetrics[]>(
      adsets,
      async (adset: { id: string }) =>
        await this.getInsights({
          id: adset.id,
          access_token: account.access_token,
        }),
    );
    if (insights.length === 0) {
      return;
    }

    const values = sql.join(
      insights.map(
        (row: TargetingMetrics) => sql`(
        ${row.ad_set_id},
        ${row.spend},
        ${row.impressions},
        ${row.social_spend},
        ${row.reach},
        ${row.clicks},
        ${row.unique_clicks},
        ${row.inline_link_clicks},
        ${row.inline_post_engagement},
        ${row.unique_ctr},
        ${row.instant_experience_clicks_to_open},
        ${row.instant_experience_clicks_to_start},
        ${row.cpm},
        ${row.cpc},
        ${row.cpp},
        ${row.ctr},
        ${row.quality_ranking},
        ${row.frequency},
        ${row.cost_per_inline_link_click},
        ${row.cost_per_inline_post_engagement},
        ${row.cost_per_unique_click},
        ${row.cost_per_unique_inline_link_click},
        ${row.engagement_rate_ranking},
        ${row.inline_link_click_ctr}
      )`,
      ),
      sql`,`,
    );

    await this.databaseService.audiences.query(
      sql`
      INSERT INTO "public"."facebook_targeting_insights"
    (
    "ad_set_id",
    "spend",
    "impressions",
    "social_spend",
    "reach",
    "clicks",
    "unique_clicks",
    "inline_link_clicks",
    "inline_post_engagement",
    "unique_ctr",
    "instant_experience_clicks_to_open",
    "instant_experience_clicks_to_start",
    "cpm",
    "cpc",
    "cpp",
    "ctr",
    "quality_ranking",
    "frequency",
    "cost_per_inline_link_click",
    "cost_per_inline_post_engagement",
    "cost_per_unique_click",
    "cost_per_unique_inline_link_click",
    "engagement_rate_ranking",
    "inline_link_click_ctr") VALUES ${values} ON CONFLICT (ad_set_id) DO NOTHING`,
    );
  }

  private async getTargetingFromFacebook(options: { id: string; access_token: string }): Promise<FacebookTargeting[]> {
    const { id, access_token } = options;
    return await this.httpService
      .get<FacebookTargeting[]>(
        `https://graph.facebook.com/v14.0/${id}?fields=name,targeting,campaign{name}&access_token=${access_token}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(map((res: AxiosResponse<any>) => res.data))
      .toPromise();
  }

  private async getAdSets(options: { account: { id: string; access_token: string } }): Promise<{ id: string }[]> {
    const { account } = options;
    return await this.paginate(
      this.httpService.get(
        `https://graph.facebook.com/v14.0/${account.id}/adsets?access_token=${account.access_token}`,
        {
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        },
      ),
    ).toPromise();
  }

  private paginate<T = any>(obs$: Observable<any>): Observable<any> {
    return obs$.pipe(
      map((res: any) => res.data),
      expand((result: any) =>
        result.paging && result.paging.next
          ? this.httpService.get(result.paging.next).pipe(
              map((res: AxiosResponse<T>) => res.data),
              catchError(() => EMPTY),
            )
          : EMPTY,
      ),
      reduce((acc: T[], res: any) => acc.concat(res.data), []),
    );
  }

  private async getInsights(options: { id: string; access_token: string }): Promise<TargetingMetrics> {
    const { id, access_token } = options;
    const body = {
      method: 'GET',
      time_range: {
        since: format(subMonths(new Date(), 36), 'yyyy-MM-dd'),
        until: format(new Date(), 'yyyy-MM-dd'),
      },
      ids: [id],
      time_increment: 'all_days',
      fields: [
        'account_currency',
        'spend',
        'impressions',
        'social_spend',
        'reach',
        'clicks',
        'unique_clicks',
        'inline_link_clicks',
        'inline_post_engagement',
        'unique_ctr',
        'instant_experience_clicks_to_open',
        'instant_experience_clicks_to_start',
        'cpm',
        'cpc',
        'cpp',
        'ctr',
        'quality_ranking',
        'frequency',
        'cost_per_inline_link_click',
        'cost_per_inline_post_engagement',
        'cost_per_unique_click',
        'cost_per_unique_inline_link_click',
        'engagement_rate_ranking',
        'inline_link_click_ctr',
      ],
    };
    const [error, insights] = await to(
      this.httpService
        .post(`https://graph.facebook.com/v14.0/insights?access_token=${access_token}`, body, {
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        })
        .pipe(map((res: AxiosResponse<any>) => res.data[id]?.data[0] || {}))
        .toPromise(),
    );
    if (error) {
      this.logger.error(error.message);
    }
    if (error || !insights || isEmpty(insights)) {
      throw new Error(`No insights for ${id}`);
    }
    return this.mapResultToMetrics(insights, id);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private mapResultToMetrics(insights: any, id: string): TargetingMetrics {
    const spend = this.exchangeAmount({
      amount: insights.spend,
      from: insights.account_currency,
    });
    const metrics = {
      spend,
      ...insights,
    };
    return {
      ad_set_id: id,
      spend: Number(metrics?.spend) || 0,
      impressions: Number(metrics?.impressions) || 0,
      social_spend: Number(metrics?.social_spend) || 0,
      reach: Number(metrics?.reach) || 0,
      clicks: Number(metrics?.clicks) || 0,
      unique_clicks: Number(metrics?.unique_clicks) || 0,
      inline_link_clicks: Number(metrics?.inline_link_clicks) || 0,
      inline_post_engagement: Number(metrics?.inline_post_engagement) || 0,
      unique_ctr: Number(metrics?.unique_ctr) || 0,
      instant_experience_clicks_to_open: Number(metrics?.instant_experience_clicks_to_open) || 0,
      instant_experience_clicks_to_start: Number(metrics?.instant_experience_clicks_to_start) || 0,
      cpm: Number(metrics?.cpm) || 0,
      cpc: Number(metrics?.cpc) || 0,
      cpp: Number(metrics?.cpp) || 0,
      ctr: Number(metrics?.ctr) || 0,
      quality_ranking: metrics?.quality_ranking,
      frequency: Number(metrics?.frequency) || 0,
      cost_per_inline_link_click: Number(metrics?.cost_per_inline_link_click) || 0,
      cost_per_inline_post_engagement: Number(metrics?.cost_per_inline_post_engagement) || 0,
      cost_per_unique_click: Number(metrics?.cost_per_unique_click) || 0,
      cost_per_unique_inline_link_click: Number(metrics?.cost_per_unique_inline_link_click) || 0,
      engagement_rate_ranking: metrics?.engagement_rate_ranking,
      inline_link_click_ctr: Number(metrics?.inline_link_click_ctr) || 0,
    };
  }

  private exchangeAmount(options: { amount; from }): number {
    const { amount, from } = options;
    if (!this.rates) {
      return amount;
    }
    return Number((amount / this.rates[from]).toFixed(4)) || amount;
  }

  private async getExchangeRates(options?: { base?: string }): Promise<Rates> {
    const base = options?.base || 'USD';
    return await this.httpService
      .get(`https://v6.exchangerate-api.com/v6/b61277dbb070581f3675590d/latest/USD`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
      .pipe(map((response) => ({ ...response?.data['conversion_rates'], [base]: 1 })))
      .toPromise();
  }
}
