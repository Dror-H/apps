import { FacebookBreakdownType } from '@instigo-app/data-transfer-object';
import { generateEntryId, mapFacebookMetricsCamel, marshalInsights } from './map-facebook-metrics';

describe('Map Facebook insights', () => {
  it('should map insights', () => {
    const entry = {
      account_currency: 'EUR',
      account_id: '37793603',
      account_name: 'Lauder Business School',
      date_start: '2020-02-04',
      date_stop: '2020-12-01',
      objective: 'MULTIPLE',
      optimization_goal: 'Unknown Optimization Goal',
      clicks: '16801',
      cost_per_inline_link_click: '0.281255',
      cost_per_inline_post_engagement: '0.234079',
      cost_per_unique_click: '0.209282',
      cpc: '0.150512',
      cpm: '1.232274',
      cpp: '5.756353',
      ctr: '0.818719',
      frequency: '4.671324',
      impressions: '2052108',
      reach: '439299',
      social_spend: '92.86',
      spend: '2528.76',
      unique_clicks: '12083',
      unique_ctr: '2.750518',
    } as any;
    const breakdown = FacebookBreakdownType.NONE;
    expect(JSON.stringify(marshalInsights(breakdown, entry))).toEqual(
      '{"id":"363b2cfe-1a63-576a-a910-f32e35b3f2d3","breakdown":"NONE","adAccountId":"37793603","campaignId":"undefined","adSetId":"undefined","adId":"undefined","country":"NULL","region":"NULL","age":"NULL","gender":"NULL","publisherPlatform":"NULL","platformPosition":"NULL","devicePlatform":"NULL","hourlyRange":"NULL","date":"2020-02-04T00:00:00.000Z","metric":{"actions":[],"actionValues":[],"attributionSetting":null,"buyingType":null,"canvasAvgViewPercent":0,"canvasAvgViewTime":0,"catalogSegmentValue":0,"clicks":16801,"conversionRateRanking":null,"conversions":[],"conversionValues":0,"convertedProductQuantity":0,"convertedProductValue":0,"costPerActionType":[],"costPerConversion":[],"costPerThruplay":0,"costPerUniqueActionType":[],"costPerUniqueClick":0.209282,"costPerUniqueInlineLinkClick":0,"costPerUniqueOutboundClick":0,"engagementRateRanking":null,"estimatedAdRecallers":0,"estimatedAdRecallRate":0,"frequency":4.671324,"fullViewImpressions":0,"fullViewReach":0,"impressions":2052108,"inlineLinkClicks":0,"inlinePostEngagement":0,"instantExperienceClicksToOpen":0,"instantExperienceClicksToStart":0,"instantExperienceOutboundClicks":0,"mobileAppPurchaseRoas":[],"objective":"MULTIPLE","optimizationGoal":"Unknown Optimization Goal","outboundClicks":0,"placePageName":null,"purchaseRoas":[],"qualifyingQuestionQualifyAnswerRate":0,"reach":439299,"socialSpend":92.86,"spend":2528.76,"uniqueClicks":12083,"video30SecWatchedActions":0,"videoAvgTimeWatchedActions":0,"videoP100WatchedActions":0,"videoP25WatchedActions":0,"videoP50WatchedActions":0,"videoP75WatchedActions":0,"videoP95WatchedActions":0,"videoPlayActions":0,"videoPlayCurveActions":[],"websiteCtr":0,"websitePurchaseRoas":[]}}',
    );
  });

  it('should mapFacebookMetricsCamel', () => {
    const entry = {
      account_currency: 'EUR',
      account_id: '37793603',
      account_name: 'Lauder Business School',
      date_start: '2020-02-04',
      date_stop: '2020-12-01',
      objective: 'MULTIPLE',
      optimization_goal: 'Unknown Optimization Goal',
      clicks: '16801',
      cost_per_inline_link_click: '0.281255',
      cost_per_inline_post_engagement: '0.234079',
      cost_per_unique_click: '0.209282',
      cpc: '0.150512',
      cpm: '1.232274',
      cpp: '5.756353',
      ctr: '0.818719',
      frequency: '4.671324',
      impressions: '2052108',
      reach: '439299',
      social_spend: '92.86',
      spend: '2528.76',
      unique_clicks: '12083',
      unique_ctr: '2.750518',
    } as any;

    const mapped = mapFacebookMetricsCamel(entry);
    expect(mapped).toContainAllKeys([
      'actions',
      'actionValues',
      'attributionSetting',
      'buyingType',
      'canvasAvgViewPercent',
      'canvasAvgViewTime',
      'catalogSegmentValue',
      'clicks',
      'conversionRateRanking',
      'conversions',
      'conversionValues',
      'convertedProductQuantity',
      'convertedProductValue',
      'costPerActionType',
      'costPerConversion',
      'costPerThruplay',
      'costPerUniqueActionType',
      'costPerUniqueClick',
      'costPerUniqueInlineLinkClick',
      'costPerUniqueOutboundClick',
      'engagementRateRanking',
      'estimatedAdRecallers',
      'estimatedAdRecallRate',
      'frequency',
      'fullViewImpressions',
      'fullViewReach',
      'impressions',
      'inlineLinkClicks',
      'inlinePostEngagement',
      'instantExperienceClicksToOpen',
      'instantExperienceClicksToStart',
      'instantExperienceOutboundClicks',
      'mobileAppPurchaseRoas',
      'objective',
      'optimizationGoal',
      'outboundClicks',
      'placePageName',
      'purchaseRoas',
      'qualifyingQuestionQualifyAnswerRate',
      'qualityRanking',
      'reach',
      'socialSpend',
      'spend',
      'uniqueClicks',
      'video30SecWatchedActions',
      'videoAvgTimeWatchedActions',
      'videoP100WatchedActions',
      'videoP25WatchedActions',
      'videoP50WatchedActions',
      'videoP75WatchedActions',
      'videoP95WatchedActions',
      'videoPlayActions',
      'videoPlayCurveActions',
      'websiteCtr',
      'websitePurchaseRoas',
    ]);
  });

  it('should generate id', () => {
    const entry = {
      adAccountId: 1375721826057841,
      campaignId: 23845897272700043,
      adSetId: 23845897272750043,
      adId: 23845897273000043,
      date: '2020-11-29',
      breakdown: 'NONE',
      region: 'NULL',
      country: 'NULL',
      age: 'NULL',
      hourlyRange: 'NULL',
      gender: 'NULL',
      platformPosition: 'NULL',
      publisherPlatform: 'NULL',
      devicePlatform: 'NULL',
    };
    expect(generateEntryId(entry)).toEqual('3b96dff1-0f4b-5414-86d9-f5184f2e4e7d');
  });
  it('should generate id', () => {
    const entry = {
      adAccountId: 1375721826057841,
      campaignId: 23845897272700043,
      adSetId: 23845897272750043,
      adId: 23845897273300043,
      date: '2020-11-29',
      breakdown: 'NONE',
      region: 'NULL',
      country: 'NULL',
      age: 'NULL',
      hourlyRange: 'NULL',
      gender: 'NULL',
      platformPosition: 'NULL',
      publisherPlatform: 'NULL',
      devicePlatform: 'NULL',
    };
    expect(generateEntryId(entry)).toEqual('c091128e-b8cf-5423-925b-b7a8d7334f1f');
  });

  it('should generate id', () => {
    const entry = {
      adAccountId: 1375721826057841,
      campaignId: 23845897272700043,
      adSetId: 23845897272750043,
      adId: 23845897273300043,
      date: '2020-08-29',
      breakdown: 'NONE',
      region: 'NULL',
      country: 'NULL',
      age: 'NULL',
      hourlyRange: 'NULL',
      gender: 'NULL',
      platformPosition: 'NULL',
      publisherPlatform: 'NULL',
      devicePlatform: 'NULL',
    };
    expect(generateEntryId(entry)).toEqual('3c0dcb81-7087-5479-a5f3-92535c549827');
  });

  it('should generate id', () => {
    const entry = {
      adAccountId: 1375721826057841,
      campaignId: 23845897272700043,
      adSetId: 23845897272750043,
      adId: 23845897273300043,
      date: '2020-08-29',
    };
    expect(generateEntryId(entry)).toEqual('841ed37d-9da1-5a77-bb39-19a29b149295');
  });
  it('id should be equal ', () => {
    const entry = {
      adAccountId: 1375721826057841,
      campaignId: 23845897272700043,
      adSetId: 23845897272750043,
      adId: 23845897273300043,
      date: '2020-08-29',
      breakdown: 'NONE',
      region: 'NULL',
      country: 'NULL',
      age: 'NULL',
      hourlyRange: 'NULL',
      gender: 'NULL',
      platformPosition: 'NULL',
      publisherPlatform: 'NULL',
      devicePlatform: 'NULL',
    };
    expect(generateEntryId(entry)).toEqual(generateEntryId(entry));
  });

  it('should generate id', () => {
    const entry = {
      adAccountId: 1375721826057841,
      campaignId: 23845897272700043,
      adSetId: 23845897272750043,
      adId: 23845897273300043,
    };
    expect(generateEntryId(entry)).not.toEqual('ffe4ac2d-2b22-5fda-8c49-f489fed79a3b');
  });
});
