import { createFacebookExportUrl } from '@audience-app/pages/audience-edit-page/utils/facebook-export-url/facebook-export-url';

const expectedLink = `https://www.facebook.com/adsmanager/manage/adsets/edit?act=23142&nav_entry_point=am_local_scope_selector&columns=name,delivery,campaign_name,bid,budget,last_significant_edit,attribution_setting,results,reach,  impressions,cost_per_result,quality_score_organic,quality_score_ectr,quality_score_ecvr,spend,end_time,schedule,frequency,unique_actions:  link_click&attribution_windows=default&selected_campaign_ids=421341&selected_adset_ids=4213412&is_reload_from_account_change`;

describe('facebook-export-url', () => {
  it('should create the link without sanitizing the ad_account', () => {
    expect(createFacebookExportUrl('23142', '421341', '4213412')).toEqual(expectedLink);
  });

  it('should sanitize ad_account link', () => {
    expect(createFacebookExportUrl('act_23142', '421341', '4213412')).toEqual(expectedLink);
  });
});
