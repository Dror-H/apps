/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getConversionRelatedFields } from '@instigo-app/data-transfer-object';
import { flatten, groupBy } from 'lodash';

export const ad_account_fields = {
  id: 'ad_accounts.id',
  name: 'ad_accounts.name',
  minDailyBudget: 'ad_accounts."minDailyBudget"',
  workspaceId: 'ad_accounts."workspaceId"',
  currency: `ad_accounts.currency`,
};

export const campaign_fields = {
  id: 'campaigns.id',
  name: 'campaigns.name',
  version: 'campaigns.version',
  createdAt: 'campaigns."createdAt"',
  updatedAt: 'campaigns."updatedAt"',
  providerId: 'campaigns."providerId"',
  provider: 'campaigns.provider',
  status: 'campaigns.status',
  objective: 'campaigns.objective',
  budget: 'campaigns.budget',
  totalBudget: 'campaigns."totalBudget"',
  budgetType: 'campaigns."budgetType"',
  startTime: 'campaigns."startTime"',
  stopTime: 'campaigns."stopTime"',
  bidStrategy: 'campaigns."bidStrategy"',
  dayParting: 'campaigns."dayParting"',
  specialCats: 'campaigns."specialCats"',
  spendCap: 'campaigns."spendCap"',
  bidAmount: 'campaigns."bidAmount"',
  budgetRemaining: 'campaigns."budgetRemaining"',
  buyingType: 'campaigns."buyingType"',
  actionTypeField: 'campaigns."actionTypeField"',
  billingEvent: 'campaigns."billingEvent"',
  ad_sets_nr: `campaigns."adSetsCount"`,
  effectiveStatus: 'campaigns."effectiveStatus"',
};

export const ad_set_fields = {
  id: 'ad_sets.id',
  createdAt: 'ad_sets."createdAt"',
  updatedAt: 'ad_sets."updatedAt"',
  version: 'ad_sets.version',
  providerId: 'ad_sets."providerId"',
  provider: 'ad_sets.provider',
  name: 'ad_sets.name',
  budget: 'ad_sets.budget',
  budgetType: 'ad_sets."budgetType"',
  status: 'ad_sets.status',
  bidStrategy: 'ad_sets."bidStrategy"',
  optimizationGoal: 'ad_sets."optimizationGoal"',
  promotedObject: 'ad_sets."promotedObject"',
  budgetRemaining: 'ad_sets."budgetRemaining"',
  dayParting: 'ad_sets."dayParting"',
  billingEvent: 'ad_sets."billingEvent"',
  actionTypeField: 'ad_sets."actionTypeField"',
};

export const ad_fields = {
  id: 'ads.id',
  createdAt: 'ads."createdAt"',
  updatedAt: 'ads."updatedAt"',
  version: 'ads.version',
  providerId: 'ads."providerId"',
  provider: 'ads.provider',
  name: 'ads.name',
  status: 'ads.status',
  effectiveStatus: 'ads."effectiveStatus"',
  thumbnailUrl: 'ads."thumbnailUrl"',
  objectStoryId: 'ads."objectStoryId"',
  instagramPermalink: 'ads."instagramPermalink"',
  actionTypeField: 'ads."actionTypeField"',
  adSetId: 'ads."adSetId"',
  campaignId: 'ads."campaignId"',
  adAccountId: 'ads."adAccountId"',
};

export function mapApiCampaign(campaign: any): any {
  const conversionsRelated = getConversionRelatedFields(campaign?.insights?.summary, campaign.actionTypeField);
  return {
    ...campaign,
    currency: campaign.adAccount.currency,
    ad_account_name: campaign.adAccount.name,
    provider: campaign.provider,
    spend: campaign.insights?.summary?.spend,
    impressions: campaign.insights?.summary?.impressions,
    clicks: campaign.insights?.summary?.clicks,
    cpc: campaign.insights?.summary?.cpc,
    cpm: campaign.insights?.summary?.cpm,
    ctr: campaign.insights?.summary?.ctr,
    frequency: campaign.insights?.summary?.frequency,
    ad_sets_nr: campaign.adSetsCount,
    unique_clicks: campaign.insights?.summary?.uniqueClicks,
    cost_per_unique_click: parseFloat(campaign.insights?.summary?.costPerUniqueClick),
    reach: campaign.insights?.summary?.reach,
    results: conversionsRelated.conversions,
    result_rate: conversionsRelated.conversionRate,
    cpa: conversionsRelated.cpa,
  };
}

export function mapApiAdset(adSet: any): any {
  const conversionsRelated = getConversionRelatedFields(adSet?.insights?.summary, adSet.actionTypeField);
  return {
    ...adSet,
    currency: adSet.adAccount.currency,
    ad_account_name: adSet.adAccount.name,
    provider: adSet.provider,
    spend: adSet.insights?.summary?.spend,
    impressions: adSet.insights?.summary?.impressions,
    clicks: adSet.insights?.summary?.clicks,
    cpc: adSet.insights?.summary?.cpc,
    cpm: adSet.insights?.summary?.cpm,
    ctr: adSet.insights?.summary?.ctr,
    frequency: adSet.insights?.summary?.frequency,
    ad_sets_nr: adSet.adSetsCount,
    unique_clicks: adSet.insights?.summary?.uniqueClicks,
    cost_per_unique_click: parseFloat(adSet.insights?.summary?.costPerUniqueClick),
    reach: adSet.insights?.summary?.reach,
    results: conversionsRelated.conversions,
    result_rate: conversionsRelated.conversionRate,
    cpa: conversionsRelated.cpa,
  };
}

export function mapApiAd(ad: any): any {
  const conversionsRelated = getConversionRelatedFields(ad?.insights?.summary, ad.actionTypeField);
  return {
    ...ad,
    bidStrategy: ad?.adSet?.bidStrategy,
    currency: ad.adAccount.currency,
    ad_account_name: ad.adAccount.name,
    provider: ad.provider,
    spend: ad.insights?.summary?.spend,
    impressions: ad.insights?.summary?.impressions,
    clicks: ad.insights?.summary?.clicks,
    cpc: ad.insights?.summary?.cpc,
    cpm: ad.insights?.summary?.cpm,
    ctr: ad.insights?.summary?.ctr,
    frequency: ad.insights?.summary?.frequency,
    ad_sets_nr: ad.adSetsCount,
    unique_clicks: ad.insights?.summary?.uniqueClicks,
    cost_per_unique_click: parseFloat(ad.insights?.summary?.costPerUniqueClick),
    reach: ad.insights?.summary?.reach,
    results: conversionsRelated.conversions,
    result_rate: conversionsRelated.conversionRate,
    cpa: conversionsRelated.cpa,
  };
}

export function getResult(actions, field) {
  const groupedActions = groupBy(flatten(actions), 'action_type');
  return Object.keys(groupedActions).reduce((accsum, key) => {
    const sum = groupedActions[key].reduce((acc: number, curr: any) => (acc += Number(curr?.value)), 0);
    return { ...accsum, [key]: sum };
  }, {})[field];
}

export function getInsights(result) {
  const summary = result?.insights?.summary;
  if (!summary) {
    return summary;
  }
  const results = getResult(
    summary?.actions,
    result?.ad?.actionTypeField || result?.ad_set?.actionTypeField || result?.campaign?.actionTypeField,
  );
  delete summary.actions;
  if (!results) {
    return summary;
  }
  return {
    ...summary,
    results,
    result_rate: 100 * (results / summary.impressions),
    cpa: summary.spend / results,
  };
}
