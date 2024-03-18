import { FacebookBreakdownType } from '@instigo-app/data-transfer-object';
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
  NULL = 'NULL',
}

export class FacebookMetricEntry {
  @Column({ name: 'actions', type: 'jsonb', array: false, default: null, nullable: true })
  actions: any;

  @Column({ name: 'action_values', type: 'jsonb', array: false, default: null, nullable: true })
  actionValues: any;

  @Column({ name: 'attribution_setting', type: 'varchar', nullable: true, default: null })
  attributionSetting: string;

  @Column({ name: 'buying_type', type: 'varchar', nullable: true, default: null })
  buyingType: string;

  @Column({ name: 'canvas_avg_view_percent', type: 'float', nullable: true, default: 0 })
  canvasAvgViewPercent: number;

  @Column({ name: 'canvas_avg_view_time', type: 'float', nullable: true, default: 0 })
  canvasAvgViewTime: number;

  @Column({ name: 'catalog_segment_value', type: 'float', nullable: true, default: 0 })
  catalogSegmentValue: number;

  @Column({ name: 'clicks', type: 'float', nullable: true, default: 0 })
  clicks: number;

  @Column({ name: 'conversion_rate_ranking', type: 'varchar', nullable: true, default: null })
  conversionRateRanking: string;

  @Column({ name: 'conversions', type: 'jsonb', array: false, default: null, nullable: true })
  conversions: any;

  @Column({ name: 'conversion_values', type: 'float', nullable: true, default: 0 })
  conversionValues: number;

  @Column({ name: 'converted_product_quantity', type: 'float', nullable: true, default: 0 })
  convertedProductQuantity: number;

  @Column({ name: 'converted_product_value', type: 'float', nullable: true, default: 0 })
  convertedProductValue: number;

  @Column({ name: 'cost_per_action_type', type: 'jsonb', array: false, default: null, nullable: true })
  costPerActionType: any;

  @Column({ name: 'cost_per_thruplay', type: 'float', nullable: true, default: 0 })
  costPerThruplay: number;

  @Column({ name: 'cost_per_unique_action_type', type: 'jsonb', array: false, default: null, nullable: true })
  costPerUniqueActionType: any;

  @Column({ name: 'cost_per_conversion', type: 'jsonb', array: false, default: null, nullable: true })
  costPerConversion: any;

  @Column({ name: 'cost_per_unique_click', type: 'float', nullable: true, default: 0 })
  costPerUniqueClick: number;

  @Column({ name: 'cost_per_unique_inline_link_click', type: 'float', nullable: true, default: 0 })
  costPerUniqueInlineLinkClick: number;

  @Column({ name: 'cost_per_unique_outbound_click', type: 'float', nullable: true, default: 0 })
  costPerUniqueOutboundClick: number;

  @Column({ name: 'engagement_rate_ranking', type: 'varchar', nullable: true, default: null })
  engagementRateRanking: string;

  @Column({ name: 'estimated_ad_recallers', type: 'float', nullable: true, default: 0 })
  estimatedAdRecallers: number;

  @Column({ name: 'estimated_ad_recall_rate', type: 'float', nullable: true, default: 0 })
  estimatedAdRecallRate: number;

  @Column({ name: 'frequency', type: 'float', nullable: true, default: 0 })
  frequency: number;

  @Column({ name: 'full_view_impressions', type: 'float', nullable: true, default: 0 })
  fullViewImpressions: number;

  @Column({ name: 'full_view_reach', type: 'float', nullable: true, default: 0 })
  fullViewReach: number;

  @Column({ name: 'impressions', type: 'float', nullable: true, default: 0 })
  impressions: number;

  @Column({ name: 'inline_link_clicks', type: 'float', nullable: true, default: 0 })
  inlineLinkClicks: number;

  @Column({ name: 'inline_post_engagement', type: 'float', nullable: true, default: 0 })
  inlinePostEngagement: number;

  @Column({ name: 'instant_experience_clicks_to_open', type: 'float', nullable: true, default: 0 })
  instantExperienceClicksToOpen: number;

  @Column({ name: 'instant_experience_clicks_to_start', type: 'float', nullable: true, default: 0 })
  instantExperienceClicksToStart: number;

  @Column({ name: 'instant_experience_outbound_clicks', type: 'float', nullable: true, default: 0 })
  instantExperienceOutboundClicks: number;

  @Column({ name: 'mobile_app_purchase_roas', type: 'jsonb', array: false, default: null, nullable: true })
  mobileAppPurchaseRoas: any;

  @Column({ name: 'objective', type: 'varchar', nullable: true, default: null })
  objective: string;

  @Column({ name: 'optimization_goal', type: 'varchar', nullable: true, default: null })
  optimizationGoal: string;

  @Column({ name: 'outbound_clicks', type: 'float', nullable: true, default: 0 })
  outboundClicks: number;

  @Column({ name: 'place_page_name', type: 'varchar', nullable: true, default: null })
  placePageName: string;

  @Column({ name: 'purchase_roas', type: 'jsonb', array: false, default: null, nullable: true })
  purchaseRoas: any;

  @Column({ name: 'qualifying_question_qualify_answer_rate', type: 'float', nullable: true, default: 0 })
  qualifyingQuestionQualifyAnswerRate: number;

  @Column({ name: 'quality_ranking', type: 'varchar', nullable: true, default: 0 })
  qualityRanking: string;

  @Column({ name: 'reach', type: 'float', nullable: true, default: 0 })
  reach: number;

  @Column({ name: 'social_spend', type: 'float', nullable: true, default: 0 })
  socialSpend: number;

  @Column({ name: 'spend', type: 'float', nullable: true, default: 0 })
  spend: number;

  @Column({ name: 'unique_clicks', type: 'float', nullable: true, default: 0 })
  uniqueClicks: number;

  @Column({ name: 'video30_sec_watched_actions', type: 'float', nullable: true, default: 0 })
  video30SecWatchedActions: number;

  @Column({ name: 'video_avg_time_watched_actions', type: 'float', nullable: true, default: 0 })
  videoAvgTimeWatchedActions: number;

  @Column({ name: 'video_p100_watched_actions', type: 'float', nullable: true, default: 0 })
  videoP100WatchedActions: number;

  @Column({ name: 'video_p25_watched_actions', type: 'float', nullable: true, default: 0 })
  videoP25WatchedActions: number;

  @Column({ name: 'video_p50_watched_actions', type: 'float', nullable: true, default: 0 })
  videoP50WatchedActions: number;

  @Column({ name: 'video_p75_watched_actions', type: 'float', nullable: true, default: 0 })
  videoP75WatchedActions: number;

  @Column({ name: 'video_p95_watched_actions', type: 'float', nullable: true, default: 0 })
  videoP95WatchedActions: number;

  @Column({ name: 'video_play_actions', type: 'float', nullable: true, default: 0 })
  videoPlayActions: number;

  @Column({ name: 'video_play_curve_actions', type: 'jsonb', array: false, default: null, nullable: true })
  videoPlayCurveActions: any;

  @Column({ name: 'website_ctr', type: 'float', nullable: true, default: 0 })
  websiteCtr: number;

  @Column({ name: 'website_purchase_roas', type: 'jsonb', array: false, default: null, nullable: true })
  websitePurchaseRoas: any;
}

@Entity({ name: 'facebook_insights' })
@Index(
  'facebook_insights_index',
  [
    'adAccountId',
    'campaignId',
    'adSetId',
    'adId',
    'breakdown',
    'date',
    'country',
    'region',
    'age',
    'gender',
    'publisherPlatform',
    'platformPosition',
    'hourlyRange',
    'devicePlatform',
  ],
  { unique: true },
)
export class FacebookInsightsEntity {
  @PrimaryColumn()
  id?: string;

  @Index('facebook_ad_account_id_insights_index', { unique: false })
  @Column({ name: 'ad_account_id', type: 'bigint' })
  adAccountId: number;

  @Index('facebook_campaign_id_insights_index', { unique: false })
  @Column({ name: 'campaign_id', nullable: true, type: 'bigint' })
  campaignId: number;

  @Index('facebook_adset_id_insights_index', { unique: false })
  @Column({ name: 'adset_id', nullable: true, type: 'bigint' })
  adSetId: number;

  @Index('facebook_ad_id_insights_index', { unique: false })
  @Column({ name: 'ad_id', nullable: true, type: 'bigint' })
  adId: number;

  @Index('facebook_date_insights_index', { unique: false })
  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: FacebookBreakdownType, nullable: false })
  breakdown: FacebookBreakdownType;

  @Column(() => FacebookMetricEntry, { prefix: false })
  metric: FacebookMetricEntry;

  @Column({ default: 'NULL', nullable: true })
  country: string;

  @Column({ default: 'NULL', nullable: true })
  region: string;

  @Column({ default: 'NULL', nullable: true })
  age: string;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.NULL, nullable: true })
  gender: GenderEnum;

  @Column({ name: 'publisher_platform', default: 'NULL', nullable: true })
  publisherPlatform: string;

  @Column({ name: 'platform_position', default: 'NULL', nullable: true })
  platformPosition: string;

  @Column({ name: 'hourly_range', default: 'NULL', nullable: true })
  hourlyRange: string;

  @Column({ name: 'device_platform', default: 'NULL', nullable: true })
  devicePlatform: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt?: Date;

  @VersionColumn({ default: 0 })
  version?: number;
}
