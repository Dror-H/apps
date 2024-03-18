export interface FacebookJobStatus {
  id: string;
  account_id: string;
  time_ref: number;
  time_completed: number;
  async_status: string;
  async_percent_completion: number;
  date_start: string;
  date_stop: string;
  is_running?: boolean;
}

export interface JobScheduled {
  report_run_id: string;
}

export interface FacebookResponse<T = any> {
  data: T[];
  paging?: Paging;
}
export interface BatchedResponse<T = any> {
  [key: string]: {
    data: T[];
    paging: Paging;
  };
}
export interface Paging {
  cursors: Cursors;
  next?: string;
  previous?: string;
  count?: number;
}

export interface Cursors {
  before: string;
  after: string;
}

export interface ArrayType {
  action_type: string;
  value: string;
}
export interface FacebookMetrics {
  account_currency: string;
  account_id: string;
  account_name: string;
  actions: ArrayType[];
  action_values: ArrayType[];
  ad_id: string;
  ad_name: string;
  adset_id: string;
  adset_name: string;
  age: string;
  attribution_setting: string;
  buying_type: string;
  campaign_id: string;
  campaign_name: string;
  canvas_avg_view_percent: number;
  canvas_avg_view_time: number;
  catalog_segment_value: ArrayType[];
  clicks: string;
  conversion_rate_ranking: string;
  conversion_values: ArrayType[];
  conversions: ArrayType[];
  converted_product_quantity: ArrayType[];
  converted_product_value: ArrayType[];
  cost_per_action_type: ArrayType[];
  cost_per_conversion: string;
  cost_per_inline_link_click: string;
  cost_per_inline_post_engagement: string;
  cost_per_thruplay: ArrayType[];
  cost_per_unique_action_type: ArrayType[];
  cost_per_unique_click: string;
  cost_per_unique_inline_link_click: string;
  cost_per_unique_outbound_click: ArrayType[];
  costPerInlineLinkClick: string;
  costPerInlinePostEngagement: string;
  costPerUniqueClick: string;
  country: string;
  cpc: string;
  cpm: string;
  cpp: string;
  ctr: string;
  date_start: string;
  date_stop: string;
  device_platform: string;
  engagement_rate_ranking: string;
  estimated_ad_recall_rate: string;
  estimated_ad_recallers: string;
  frequency: string;
  full_view_impressions: string;
  full_view_reach: string;
  gender: string;
  hourly_stats_aggregated_by_audience_time_zone: string;
  impressions: string;
  inline_link_click_ctr: string;
  inline_link_clicks: string;
  inline_post_engagement: string;
  instant_experience_clicks_to_open: string;
  instant_experience_clicks_to_start: string;
  instant_experience_outbound_clicks: ArrayType[];
  mobile_app_purchase_roas: ArrayType[];
  objective: string;
  optimization_goal: string;
  outbound_clicks: ArrayType[];
  place_page_name: string;
  platform_position: string;
  publisher_platform: string;
  purchase_roas: ArrayType[];
  qualifying_question_qualify_answer_rate: number;
  quality_ranking: string;
  reach: string;
  region: string;
  social_spend: string;
  spend: string;
  unique_clicks: string;
  unique_ctr: string;
  uniqueClicks: string;
  uniqueCtr: string;
  video_30_sec_watched_actions: ArrayType[];
  video_avg_time_watched_actions: ArrayType[];
  video_p100_watched_actions: ArrayType[];
  video_p25_watched_actions: ArrayType[];
  video_p50_watched_actions: ArrayType[];
  video_p75_watched_actions: ArrayType[];
  video_p95_watched_actions: ArrayType[];
  video_play_actions: ArrayType[];
  video_play_curve_actions: any[];
  website_ctr: ArrayType[];
  website_purchase_roas: ArrayType[];
  wish_bid: string;
}
