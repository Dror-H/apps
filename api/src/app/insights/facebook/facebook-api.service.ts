import { sleep } from '@instigo-app/api-shared';
import { TimeIncrement, TimeRange } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FacebookApiService {
  protected readonly logger = new Logger('FacebookApiService');
  private FACEBOOK_HOST = 'https://graph.facebook.com/v14.0';

  private detailsFields = [
    'account_currency',
    'account_id',
    'account_name',
    'ad_id',
    'ad_name',
    'adset_id',
    'adset_name',
    'buying_type',
    'campaign_id',
    'campaign_name',
    'date_start',
    'date_stop',
    'objective',
    'optimization_goal',
  ];

  private defaultFields = [
    'clicks',
    'conversions',
    'cost_per_conversion',
    'cost_per_inline_link_click',
    'cost_per_inline_post_engagement',
    'cost_per_unique_click',
    'cpc',
    'cpm',
    'cpp',
    'ctr',
    'frequency',
    'impressions',
    'outbound_clicks',
    'reach',
    'social_spend',
    'spend',
    'unique_clicks',
    'unique_ctr',
  ];

  private extraFields = [
    'action_values',
    'actions',
    'attribution_setting',
    'canvas_avg_view_percent',
    'canvas_avg_view_time',
    'catalog_segment_value',
    'conversion_rate_ranking',
    'conversion_values',
    'converted_product_quantity',
    'converted_product_value',
    'cost_per_action_type',
    'cost_per_estimated_ad_recallers',
    'cost_per_outbound_click',
    'cost_per_thruplay',
    'cost_per_unique_action_type',
    'cost_per_unique_inline_link_click',
    'cost_per_unique_outbound_click',
    'engagement_rate_ranking',
    'estimated_ad_recall_rate',
    'estimated_ad_recallers',
    'full_view_impressions',
    'full_view_reach',
    'inline_link_click_ctr',
    'inline_link_clicks',
    'inline_post_engagement',
    'instant_experience_clicks_to_open',
    'instant_experience_clicks_to_start',
    'instant_experience_outbound_clicks',
    'mobile_app_purchase_roas',
    'outbound_clicks_ctr',
    'place_page_name',
    'purchase_roas',
    'qualifying_question_qualify_answer_rate',
    'quality_ranking',
    'video_30_sec_watched_actions',
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
  ];

  facebookTimeIncrement = {
    [TimeIncrement.ALL]: 'all_days',
    [TimeIncrement.DAILY]: '1',
    [TimeIncrement.MONTHLY]: '30',
  };

  private NUMBER_OF_ATTEMPTS = 10;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  private getWaitingTime(error: AxiosError, accountId: string): number {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const headers = error?.response?.headers || {};
      const usage = JSON.parse(headers['x-business-use-case-usage']) || '{}';
      const business = usage[accountId.split('_')[1]];
      const minutes = (business[0]['estimated_time_to_regain_access'] as number) || 1;
      return minutes;
    } catch (e) {
      return 1; // ONE_MINUTE
    }
  }

  private async getURLData(options: any) {
    const { url } = options;
    const [error, response] = await to(this.httpService.get(url).toPromise());
    if (error) {
      return await this.handleError(error, options);
    }
    if (!response.data?.paging?.next) {
      return response.data.data;
    }
    return [...response.data.data, ...(await this.getInsights({ ...options, url: response.data?.paging?.next }))];
  }

  public async getInsights(options: {
    accessToken: string;
    accountId: string;
    providerId: string;
    timeRange: TimeRange;
    breakdown?: string[];
    level?: string;
    time_increment?: TimeIncrement | string;
    // internal
    attempts?: number;
    url?: string;
  }): Promise<any> {
    const {
      accessToken,
      providerId,
      timeRange,
      breakdown = [],
      level = 'ad',
      time_increment = TimeIncrement.DAILY,
      url,
    } = options;

    const params = {
      method: 'GET',
      accessToken,
      time_range: {
        since: format(new Date(timeRange.start), 'yyyy-MM-dd'),
        until: format(new Date(timeRange.end), 'yyyy-MM-dd'),
      },
      level: level,
      time_increment: this.facebookTimeIncrement[time_increment],
      ids: [providerId],
      fields: [...this.detailsFields, ...this.defaultFields, ...(breakdown?.length === 0 ? this.extraFields : [])],
      limit: 1,
      breakdowns: [...Array.from(breakdown || [])],
    };

    if (url) {
      return await this.getURLData(options);
    }

    const [error, response] = await to(
      this.httpService.post(`${this.FACEBOOK_HOST}/insights?access_token=${accessToken}`, params).toPromise(),
    );

    if (error) {
      return await this.handleError(error, options);
    }

    const data = response.data[`${providerId}`];
    const hasPages = data?.paging && data.paging.next;
    if (hasPages) {
      await sleep(100);
      return [...data.data, ...(await this.getInsights({ ...options, url: data.paging.next }))];
    }

    return data?.data;
  }

  private async handleError(error, options) {
    const { attempts = 0, providerId } = options;
    const fberror = error.response?.data?.error;
    if (!(fberror?.code === 80000)) {
      this.logger.error(`facebook: ${fberror?.message}`);
    }
    this.logger.log(JSON.stringify(error));
    const minutes = this.getWaitingTime(error as AxiosError, providerId);
    await this.waitFor(minutes);
    if (attempts < 10) {
      return this.getInsights({ ...options, attempts: Number(attempts || 0) + 1 });
    }
    throw error;
  }

  private async waitFor(minutes: number) {
    this.logger.log(`Wait for ${minutes} minutes`);
    await sleep(minutes * 60 * 1001);
  }
}
