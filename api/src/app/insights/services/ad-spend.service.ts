/* eslint-disable max-len */
import { ExchangeRateService } from '@api/exchange-rate/exchange-rate.service';
import { AdSpendDetails, TimeRange, User } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { to } from 'await-to-js';
import { endOfDay, format, subDays } from 'date-fns';
import { getManager } from 'typeorm';

@Injectable()
export class AdSpendService {
  private readonly logger = new Logger(AdSpendService.name);

  @Inject(ExchangeRateService)
  private readonly exchangeRateService: ExchangeRateService;

  async userAdSpend(options: { user: Partial<User>; timeRange?: TimeRange }): Promise<AdSpendDetails> {
    const { user } = options;
    let { timeRange } = options;
    if (!timeRange) {
      timeRange = {
        start: subDays(new Date(), 30),
        end: endOfDay(new Date()),
      };
    }
    const date_query = `BETWEEN CAST('${format(new Date(timeRange.start), 'yyyy-MM-dd')}' AS DATE) AND CAST('${format(
      new Date(timeRange.end),
      'yyyy-MM-dd',
    )}' AS DATE)\n`;

    const sub_query = `
    SELECT
    campaign_through_instigo_records.workspace_id,
    campaign_through_instigo_records.ad_account_id,
    ad_accounts.currency,
    ROUND(SUM(COALESCE(facebook_insights.spend,0))::int, 2) as spend
    FROM campaign_through_instigo_records
    LEFT JOIN facebook_insights ON facebook_insights.campaign_id=campaign_through_instigo_records.provider_id
    LEFT JOIN ad_accounts ON cast(COALESCE(NULLIF(SPLIT_PART(ad_accounts."providerId", '_', 2), ''), ad_accounts."providerId") as numeric)=campaign_through_instigo_records.ad_account_id
    WHERE facebook_insights.breakdown='NONE'\n
    and campaign_through_instigo_records.user_id='${user.id}'\n
    AND facebook_insights.date ${date_query}
    GROUP BY campaign_through_instigo_records.workspace_id, campaign_through_instigo_records.ad_account_id,ad_accounts.currency
    UNION
    SELECT
    campaign_through_instigo_records.workspace_id,
    campaign_through_instigo_records.ad_account_id,
    ad_accounts.currency,
    ROUND(SUM(COALESCE(linkedin_insights.spend,0))::int, 2) as spend
    FROM campaign_through_instigo_records
    LEFT JOIN linkedin_insights ON linkedin_insights.campaign_id=campaign_through_instigo_records.provider_id
    LEFT JOIN ad_accounts ON cast(COALESCE(NULLIF(SPLIT_PART(ad_accounts."providerId", '_', 2), ''), ad_accounts."providerId") as numeric)=campaign_through_instigo_records.ad_account_id
    WHERE linkedin_insights.breakdown='NONE'\n
    and campaign_through_instigo_records.user_id='${user.id}'\n
    AND linkedin_insights.date ${date_query}
    GROUP BY campaign_through_instigo_records.workspace_id,campaign_through_instigo_records.ad_account_id,ad_accounts.currency`;

    const [breakdown_err, breakdown] = await to(getManager().query(`${sub_query}`));
    if (breakdown_err) {
      this.logger.error(`Error while fetching ad spend for user ${user.id}`);
      return { data: [], total: 0, currency: 'USD' };
    }
    const [err, total] = await to(this.getTotalSpendInUsd({ breakdown }));
    return { data: breakdown, total: err ? 0 : total, currency: 'USD' };
  }

  private async getTotalSpendInUsd(options: { breakdown: any[] }) {
    const { breakdown } = options;
    const [err, rates] = await to(this.exchangeRateService.exchangeRates({}));
    if (err) {
      this.logger.error(err);
      return 0;
    }
    const totalSpendInUsd = breakdown.reduce((total, ad_account) => {
      const { currency, spend } = ad_account;
      return (total += this.exchangeRateService.exchangeAmount({ amount: spend, from: currency, rates }));
    }, 0);
    return totalSpendInUsd;
  }
}
