export const createFacebookExportUrl = (adAccountId: string, campaignId: string, adSetId: string) => {
  if (adAccountId.indexOf('act_') >= 0) {
    adAccountId = adAccountId.split('act_')[1];
  }
  return `https://www.facebook.com/adsmanager/manage/adsets/edit?act=${adAccountId}&nav_entry_point=am_local_scope_selector&columns=name,delivery,campaign_name,bid,budget,last_significant_edit,attribution_setting,results,reach,  impressions,cost_per_result,quality_score_organic,quality_score_ectr,quality_score_ecvr,spend,end_time,schedule,frequency,unique_actions:  link_click&attribution_windows=default&selected_campaign_ids=${campaignId}&selected_adset_ids=${adSetId}&is_reload_from_account_change`;
};
