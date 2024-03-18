import { isValid, parseISO } from 'date-fns';
import { v5 as uuidv5 } from 'uuid';
import { FacebookInsightsEntity, GenderEnum } from '../data/facebook-insights.entity';
import { FacebookMetrics } from './model.facebook';

export function generateEntryId(entry) {
  const byteString = `
  ${entry.adAccountId},
  ${entry.campaignId},
  ${entry.adSetId},
  ${entry.adId},
  ${new Date(entry.date || new Date()).toISOString()}},
  ${entry.breakdown},
  ${entry.country},
  ${entry.region},
  ${entry.age},
  ${entry.gender},
  ${entry.publisherPlatform},
  ${entry.platformPosition},
  ${entry.hourlyRange},
  ${entry.devicePlatform}`
    .replace(/\s/gi, '')
    .toString();
  return uuidv5(byteString, uuidv5.URL);
}

export function marshalInsights(breakdown, data: FacebookMetrics) {
  const metric = mapFacebookMetricsCamel({ data: data });
  const entry = {
    id: '',
    breakdown,
    adAccountId: String(data?.account_id) || 0,
    campaignId: String(data?.campaign_id) || 0,
    adSetId: String(data?.adset_id) || 0,
    adId: String(data?.ad_id) || 0,
    country: data?.country || 'NULL',
    region: data?.region || 'NULL',
    age: data?.age || 'NULL',
    gender: (data?.gender as GenderEnum.NULL) || GenderEnum.NULL,
    publisherPlatform: data?.publisher_platform || 'NULL',
    platformPosition: data?.platform_position || 'NULL',
    devicePlatform: data?.device_platform || 'NULL',
    hourlyRange: data?.hourly_stats_aggregated_by_audience_time_zone || 'NULL',
    date: isValid(parseISO(data?.date_start)) ? new Date(data?.date_start) : ('NULL' as unknown as Date),
    metric,
  };
  entry.id = generateEntryId(entry);
  return entry as FacebookInsightsEntity;
}

export function mapFacebookMetricsCamel(options: { data: Partial<FacebookMetrics> }): any {
  const { data } = options;
  return {
    actions: data?.actions || [], // JSONB
    actionValues: data?.action_values || [], // JSONB
    attributionSetting: data?.attribution_setting || null,
    buyingType: data?.buying_type || null,
    canvasAvgViewPercent: Number(data?.canvas_avg_view_percent) || 0,
    canvasAvgViewTime: Number(data?.canvas_avg_view_time) || 0,
    catalogSegmentValue: Number(data?.catalog_segment_value?.[0]?.value) || 0,
    clicks: Number(data?.clicks) || 0,
    conversionRateRanking: data?.conversion_rate_ranking || null,
    conversions: data?.conversions || [], // JSONB
    conversionValues: Number(data?.conversion_values?.[0]?.value) || 0,
    convertedProductQuantity: Number(data?.converted_product_quantity?.[0]?.value) || 0,
    convertedProductValue: Number(data?.converted_product_value?.[0]?.value) || 0,
    costPerActionType: data?.cost_per_action_type || [], // JSONB
    costPerConversion: data?.cost_per_conversion || [], // JSONB
    costPerThruplay: Number(data?.cost_per_thruplay?.[0]?.value) || 0,
    costPerUniqueActionType: data?.cost_per_unique_action_type || [], // JSONB
    costPerUniqueClick: Number(data?.cost_per_unique_click) || 0,
    costPerUniqueInlineLinkClick: Number(data?.cost_per_unique_inline_link_click) || 0,
    costPerUniqueOutboundClick: Number(data?.cost_per_unique_outbound_click?.[0]?.value) || 0,
    engagementRateRanking: data?.engagement_rate_ranking || null,
    estimatedAdRecallers: Number(data?.estimated_ad_recallers) || 0,
    estimatedAdRecallRate: Number(data?.estimated_ad_recall_rate) || 0,
    frequency: Number(data?.frequency) || 0,
    fullViewImpressions: Number(data?.full_view_impressions) || 0,
    fullViewReach: Number(data?.full_view_reach) || 0,
    impressions: Number(data?.impressions) || 0,
    inlineLinkClicks: Number(data?.inline_link_clicks) || 0,
    inlinePostEngagement: Number(data?.inline_post_engagement) || 0,
    instantExperienceClicksToOpen: Number(data?.instant_experience_clicks_to_open) || 0,
    instantExperienceClicksToStart: Number(data?.instant_experience_clicks_to_start) || 0,
    instantExperienceOutboundClicks: Number(data?.instant_experience_outbound_clicks?.[0]?.value) || 0,
    mobileAppPurchaseRoas: data?.mobile_app_purchase_roas || [], // JSONB
    objective: data?.objective || null,
    optimizationGoal: data?.optimization_goal || null,
    outboundClicks: Number(data?.outbound_clicks?.[0]?.value) || 0,
    placePageName: data?.place_page_name || null,
    purchaseRoas: data?.purchase_roas || [], // JSONB
    qualifyingQuestionQualifyAnswerRate: Number(data?.qualifying_question_qualify_answer_rate) || 0,
    qualityRanking: data?.quality_ranking,
    reach: Number(data?.reach) || 0,
    socialSpend: Number(data?.social_spend) || 0,
    spend: Number(data?.spend) || 0,
    uniqueClicks: Number(data?.unique_clicks) || 0,
    video30SecWatchedActions: Number(data?.video_30_sec_watched_actions?.[0]?.value) || 0,
    videoAvgTimeWatchedActions: Number(data?.video_avg_time_watched_actions?.[0]?.value) || 0,
    videoP100WatchedActions: Number(data?.video_p100_watched_actions?.[0]?.value) || 0,
    videoP25WatchedActions: Number(data?.video_p25_watched_actions?.[0]?.value) || 0,
    videoP50WatchedActions: Number(data?.video_p50_watched_actions?.[0]?.value) || 0,
    videoP75WatchedActions: Number(data?.video_p75_watched_actions?.[0]?.value) || 0,
    videoP95WatchedActions: Number(data?.video_p95_watched_actions?.[0]?.value) || 0,
    videoPlayActions: Number(data?.video_play_actions?.[0]?.value) || 0,
    videoPlayCurveActions: data?.video_play_curve_actions || [], // JSONB
    websiteCtr: Number(data?.website_ctr?.[0]?.value) || 0,
    websitePurchaseRoas: data?.website_purchase_roas || [], // JSONB
  };
}
