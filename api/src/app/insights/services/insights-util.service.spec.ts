import { Test } from '@nestjs/testing';
import { InsightsUtilService } from './insights-util.service';
import { ad_account_fields } from './insights.helper';

describe('InsightsUtilService Test suite', () => {
  let service: InsightsUtilService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [InsightsUtilService],
    }).compile();

    service = module.get<InsightsUtilService>(InsightsUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return where time', () => {
    const range = {
      start: new Date('2018-05-17'),
      end: new Date('2021-06-17'),
    };
    const whereTime = service.whereTime({ timeRange: range });
    expect(whereTime).toEqual("AND date BETWEEN CAST('2018-05-17' AS DATE) AND CAST('2021-06-17' AS DATE)");
  });

  it('should return json', () => {
    expect(service.jsonObject(ad_account_fields, 'ad_account')).toEqual(
      `json_build_object('id', ad_accounts.id,\n'name', ad_accounts.name,\n'minDailyBudget', ad_accounts."minDailyBudget",\n'workspaceId', ad_accounts."workspaceId",\n'currency', ad_accounts.currency) ::jsonb as ad_account`,
    );
  });

  it('should json to selection', () => {
    expect(service.jsonToSelection(ad_account_fields)).toEqual(
      'ad_accounts.id as id, ad_accounts.name as name, ad_accounts."minDailyBudget" as minDailyBudget, ad_accounts."workspaceId" as workspaceId, ad_accounts.currency as currency',
    );
  });

  it('should return facebookRowMetrics', () => {
    expect(service.facebookRowMetrics()).toEqual({
      clicks: 'ROUND( COALESCE(facebook_insights.clicks, 0) ::int , 2)',
      cost_per_estimated_ad_recallers:
        'ROUND(CAST(ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.estimated_ad_recallers, 0) ::int , 2),0) as NUMERIC), 2)',
      cost_per_inline_link_click:
        'ROUND(CAST(ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.inline_link_clicks, 0) ::int , 2),0) as NUMERIC), 2)',
      cost_per_inline_post_engagement:
        'ROUND(CAST(ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.inline_post_engagement, 0) ::int , 2),0) as NUMERIC), 2)',
      cost_per_unique_click: 'ROUND(CAST(facebook_insights.cost_per_unique_click as NUMERIC), 2)',
      cpc: 'ROUND(CAST(ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.clicks, 0) ::int , 2),0) as NUMERIC),2)',
      cpm: 'ROUND(CAST(((ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)*1000)/NULLIF(ROUND( COALESCE(facebook_insights.impressions, 0) ::int , 2),0)) as NUMERIC),2)',
      cpp: 'ROUND(CAST(ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.reach, 0) ::int , 2),0) as NUMERIC), 2)',
      ctr: 'ROUND(CAST((ROUND( COALESCE(facebook_insights.clicks, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.impressions, 0) ::int , 2),0))*100 as NUMERIC),2)',
      frequency: 'ROUND( CAST(facebook_insights.frequency as numeric) , 2)',
      impressions: 'ROUND( COALESCE(facebook_insights.impressions, 0) ::int , 2)',
      inline_link_click_ctr:
        'ROUND(CAST(ROUND( COALESCE(facebook_insights.inline_link_clicks, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.impressions, 0) ::int , 2),0) as NUMERIC), 2)',
      inline_link_clicks: 'ROUND( COALESCE(facebook_insights.inline_link_clicks, 0) ::int , 2)',
      inline_post_engagement: 'ROUND( COALESCE(facebook_insights.inline_post_engagement, 0) ::int , 2)',
      outbound_clicks: 'ROUND( COALESCE(facebook_insights.outbound_clicks, 0) ::int , 2)',
      outbound_clicks_ctr:
        'ROUND(CAST(ROUND( COALESCE(facebook_insights.outbound_clicks, 0) ::int , 2)/NULLIF(ROUND( COALESCE(facebook_insights.impressions, 0) ::int , 2),0) as NUMERIC), 2)',
      reach: 'ROUND( COALESCE(facebook_insights.reach, 0) ::int , 2)',
      social_spend: 'ROUND( COALESCE(facebook_insights.social_spend, 0) ::int , 2)',
      spend: 'ROUND( COALESCE(facebook_insights.spend, 0) ::int , 2)',
      unique_clicks: 'ROUND(CAST(facebook_insights.unique_clicks as NUMERIC),2)',
    });
  });

  it('should return facebookSumMetrics', () => {
    expect(service.facebookSumMetrics()).toEqual({
      clicks: 'ROUND( SUM( COALESCE(facebook_insights.clicks,0) )::int , 2)',
      cost_per_estimated_ad_recallers:
        'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.estimated_ad_recallers,0) )::int , 2),0) as NUMERIC), 2)',
      cost_per_inline_link_click:
        'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.inline_link_clicks,0) )::int , 2),0) as NUMERIC), 2)',
      cost_per_inline_post_engagement:
        'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.inline_post_engagement,0) )::int , 2),0) as NUMERIC), 2)',
      cost_per_unique_click: 'ROUND(CAST(AVG(facebook_insights.cost_per_unique_click) as NUMERIC), 2)',
      cpc: 'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.clicks,0) )::int , 2),0) as NUMERIC),2)',
      cpm: 'ROUND(CAST(((ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)*1000)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.impressions,0) )::int , 2),0)) as NUMERIC),2)',
      cpp: 'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.reach,0) )::int , 2),0) as NUMERIC), 2)',
      ctr: 'ROUND(CAST((ROUND( SUM( COALESCE(facebook_insights.clicks,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.impressions,0) )::int , 2),0))*100 as NUMERIC),2)',
      frequency: 'ROUND( CAST(AVG(facebook_insights.frequency) as numeric) , 2)',
      impressions: 'ROUND( SUM( COALESCE(facebook_insights.impressions,0) )::int , 2)',
      inline_link_click_ctr:
        'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.inline_link_clicks,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.impressions,0) )::int , 2),0) as NUMERIC), 2)',
      inline_link_clicks: 'ROUND( SUM( COALESCE(facebook_insights.inline_link_clicks,0) )::int , 2)',
      inline_post_engagement: 'ROUND( SUM( COALESCE(facebook_insights.inline_post_engagement,0) )::int , 2)',
      outbound_clicks: 'ROUND( SUM( COALESCE(facebook_insights.outbound_clicks,0) )::int , 2)',
      outbound_clicks_ctr:
        'ROUND(CAST(ROUND( SUM( COALESCE(facebook_insights.outbound_clicks,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(facebook_insights.impressions,0) )::int , 2),0) as NUMERIC), 2)',
      reach: 'ROUND( SUM( COALESCE(facebook_insights.reach,0) )::int , 2)',
      social_spend: 'ROUND( SUM( COALESCE(facebook_insights.social_spend,0) )::int , 2)',
      spend: 'ROUND( SUM( COALESCE(facebook_insights.spend,0) )::int , 2)',
      unique_clicks: 'ROUND(CAST(AVG(facebook_insights.unique_clicks) as NUMERIC),2)',
    });
  });

  it('should return linkedinRowMetrics', () => {
    expect(service.linkedinRowMetrics()).toEqual({
      clicks: 'ROUND( COALESCE(linkedin_insights.clicks, 0) ::int , 2)',
      comments: 'ROUND( COALESCE(linkedin_insights.comments, 0) ::int , 2)',
      cpc: 'ROUND(CAST(ROUND( COALESCE(linkedin_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(linkedin_insights.clicks, 0) ::int , 2),0) as NUMERIC),2)',
      cpm: 'ROUND(CAST(((ROUND( COALESCE(linkedin_insights.spend, 0) ::int , 2)*1000)/NULLIF(ROUND( COALESCE(linkedin_insights.impressions, 0) ::int , 2),0)) as NUMERIC),2)',
      cpp: 'ROUND(CAST(ROUND( COALESCE(linkedin_insights.spend, 0) ::int , 2)/NULLIF(ROUND( COALESCE(linkedin_insights.reach, 0) ::int , 2),0) as NUMERIC), 2)',
      ctr: 'ROUND(CAST((ROUND( COALESCE(linkedin_insights.clicks, 0) ::int , 2)/NULLIF(ROUND( COALESCE(linkedin_insights.impressions, 0) ::int , 2),0))*100 as NUMERIC),2)',
      frequency: 'ROUND( CAST(linkedin_insights.frequency as numeric) , 2)',
      impressions: 'ROUND( COALESCE(linkedin_insights.impressions, 0) ::int , 2)',
      likes: 'ROUND( COALESCE(linkedin_insights.likes, 0) ::int , 2)',
      reach: 'ROUND( COALESCE(linkedin_insights.reach, 0) ::int , 2)',
      shares: 'ROUND( COALESCE(linkedin_insights.shares, 0) ::int , 2)',
      spend: 'ROUND( COALESCE(linkedin_insights.spend, 0) ::int , 2)',
    });
  });

  it('should return linkedinSumMetrics', () => {
    expect(service.linkedinSumMetrics()).toEqual({
      clicks: 'ROUND( SUM( COALESCE(linkedin_insights.clicks,0) )::int , 2)',
      comments: 'ROUND( SUM( COALESCE(linkedin_insights.comments,0) )::int , 2)',
      cpc: 'ROUND(CAST(ROUND( SUM( COALESCE(linkedin_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(linkedin_insights.clicks,0) )::int , 2),0) as NUMERIC),2)',
      cpm: 'ROUND(CAST(((ROUND( SUM( COALESCE(linkedin_insights.spend,0) )::int , 2)*1000)/NULLIF(ROUND( SUM( COALESCE(linkedin_insights.impressions,0) )::int , 2),0)) as NUMERIC),2)',
      cpp: 'ROUND(CAST(ROUND( SUM( COALESCE(linkedin_insights.spend,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(linkedin_insights.reach,0) )::int , 2),0) as NUMERIC), 2)',
      ctr: 'ROUND(CAST((ROUND( SUM( COALESCE(linkedin_insights.clicks,0) )::int , 2)/NULLIF(ROUND( SUM( COALESCE(linkedin_insights.impressions,0) )::int , 2),0))*100 as NUMERIC),2)',
      frequency: 'ROUND( CAST(AVG(linkedin_insights.frequency) as numeric) , 2)',
      impressions: 'ROUND( SUM( COALESCE(linkedin_insights.impressions,0) )::int , 2)',
      likes: 'ROUND( SUM( COALESCE(linkedin_insights.likes,0) )::int , 2)',
      reach: 'ROUND( SUM( COALESCE(linkedin_insights.reach,0) )::int , 2)',
      shares: 'ROUND( SUM( COALESCE(linkedin_insights.shares,0) )::int , 2)',
      spend: 'ROUND( SUM( COALESCE(linkedin_insights.spend,0) )::int , 2)',
    });
  });
});
