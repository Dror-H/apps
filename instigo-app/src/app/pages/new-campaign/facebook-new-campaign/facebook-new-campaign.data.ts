import { FacebookBidStrategyEnum, FacebookConnections } from '@instigo-app/data-transfer-object';
// ! Campaign Creation Overview Panels
export const overviewSections = [
  {
    id: 'campaign',
    name: 'Campaign',
    icon: 'newcamp-ov-1.png',
    subSections: [
      { formControl: 'settings.account', name: 'Ad Account' },
      { formControl: 'settings.name', name: 'Campaign Name' },
      { formControl: 'settings.buyingType', name: 'Buying Type' },
      { formControl: 'settings.objective', name: 'Objective' },
      { formControl: 'settings.specialCats', name: 'Ad Categories' },
      { formControl: 'settings.specialCatsOptions', name: 'Options' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: 'newcamp-ov-2.png',
    subSections: [],
  },
  {
    id: 'targeting',
    name: 'Targeting',
    icon: 'newcamp-ov-4.png',
    subSections: [],
  },
  {
    id: 'budget',
    name: 'Budget & Time',
    icon: 'newcamp-ov-5.png',
    subSections: [],
  },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: 'newcamp-ov-3.png',
    subSections: [],
  },
];

export const facebookCampaignObjectives = [
  {
    title: 'Traffic',
    short: 'Direct people to visit a specific destination',
    desc: 'Send people to a destination, like a website, app, Facebook event or Messenger conversation.',
    icon: 'fas fa-cars',
    active: true,
    value: 'LINK_CLICKS',
    defaultOptimizationGoal: 'LINK_CLICKS',
  },
  {
    title: 'Conversions',
    short: 'Show ads to people who are likely to take action',
    desc: 'Show your ads to people most likely to take valuable actions, like making a purchase or adding payment info, on your website, app or in Messenger.',
    icon: 'fas fa-bags-shopping',
    active: true,
    value: 'CONVERSIONS',
    defaultOptimizationGoal: 'OFFSITE_CONVERSIONS',
  },
  {
    title: 'Lead Generation',
    short: 'Collect leads and prospects for your business or brand',
    desc: 'Collect leads for your business or brand.',
    icon: 'fas fa-user-tie',
    value: 'LEAD_GENERATION',
    active: true,
    defaultOptimizationGoal: 'LEAD_GENERATION',
  },
  {
    title: 'Post Engagement',
    short: 'Increase your post interactions',
    desc: 'Get more Page likes, event responses, or post reacts, comments or shares.',
    icon: 'fas fa-comments',
    active: true,
    value: 'POST_ENGAGEMENT',
    defaultOptimizationGoal: 'POST_ENGAGEMENT',
  },
  {
    title: 'Page Likes',
    short: 'Increase your page interactions',
    desc: 'Get more Page likes, event responses, or post reacts, comments or shares.',
    icon: 'fas fa-comments',
    active: true,
    value: 'PAGE_LIKES',
    defaultOptimizationGoal: 'PAGE_LIKES',
  },
  {
    title: 'Event Responses',
    short: 'Increase your event interactions',
    desc: 'Get more Page likes, event responses, or post reacts, comments or shares.',
    icon: 'fas fa-comments',
    active: true,
    value: 'EVENT_RESPONSES',
    defaultOptimizationGoal: 'EVENT_RESPONSES',
  },
  {
    title: 'Brand Awareness',
    short: 'Promote your brand among your target audience',
    desc: 'Send people to a destination, like a website, app, Facebook event or Messenger conversation.',
    icon: 'fas fa-bullhorn',
    active: true,
    value: 'BRAND_AWARENESS',
    defaultOptimizationGoal: 'AD_RECALL_LIFT',
  },
  {
    title: 'Reach',
    short: 'Show ads to the maximum number of people.',
    desc: 'Show your ads to the maximum number of people.',
    icon: 'fas fa-chart-network',
    active: true,
    value: 'REACH',
    defaultOptimizationGoal: 'REACH',
  },
  {
    title: 'App Installs',
    short: 'Get more downloads for your mobile app',
    desc: 'Show your ad to people most likely to download and engage with your app.',
    icon: 'fas fa-mobile',
    value: 'APP_INSTALLS',
    defaultOptimizationGoal: 'APP_INSTALLS',
  },
  {
    title: 'App Engagement',
    short: 'Get more downloads for your mobile app',
    desc: 'Show your ad to people most likely to download and engage with your app.',
    icon: 'fas fa-mobile',
    value: 'NO_VALUE_YET',
    defaultOptimizationGoal: '',
  },
  {
    title: 'Video Views',
    short: 'Show video ads to people in your target audience',
    desc: 'Show people video ads.',
    icon: 'fas fa-camera-movie',
    value: 'VIDEO_VIEWS',
    active: true,
    defaultOptimizationGoal: 'THRUPLAY',
  },
  {
    title: 'Messages',
    short: 'Get people to contact you via Messenger & Instagram',
    desc: 'Get more people to send messages to your business on Messenger and Instagram Direct.',
    icon: 'fas fa-envelope-open',
    value: 'MESSAGES',
    defaultOptimizationGoal: 'REPLIES',
  },
];

// ! Special Categories Options
export const campaignSpecialCats = [
  {
    id: 1,
    name: 'Credit',
    desc: 'Ads for credit card offers, auto loans, long-term financing or other related opportunities.',
    icon: 'fas fa-credit-card-front',
  },
  {
    id: 2,
    name: 'Employment',
    desc: 'Ads for job offers, internships, professional certification programs or other related opportunities.',
    icon: 'fas fa-briefcase',
  },
  {
    id: 3,
    name: 'Housing',
    desc: 'Ads for real estate listings, homeowners insurance, mortgage loans or other related opportunities.',
    icon: 'fas fa-house',
  },
  {
    id: 4,
    name: 'Social Issues, Elections or Politics',
    desc: 'Ads about social issues (such as the economy, or civil and social rights), elections, or political figures or campaigns',
    icon: 'fas fa-box-ballot',
  },
];

export const postTypeOptions = [
  {
    id: 0,
    title: 'Use Existing Posts',
  },
  {
    id: 1,
    title: 'Create New Post',
  },
];

export const existingPostsTypeOptions = [
  {
    id: 0,
    title: 'Facebook Page',
  },
  {
    id: 1,
    title: 'Instagram Feed',
  },
  {
    id: 2,
    title: 'Branded Content',
  },
];

// ! Preview Placement Options
export const adPlacementsOptions = [
  {
    id: 0,
    name: 'Desktop',
  },
  {
    id: 0,
    name: 'Mobile',
  },
  {
    id: 0,
    name: 'App',
  },
  {
    id: 0,
    name: 'Right Panel',
  },
];

// ! Columns for Ad Templates Table
export const adTemplatesTableColumns = [
  {
    name: 'Name',
    prop: 'name',
    show: true,
    width: '35%',
    ellipsis: true,
    freezeLeft: true,
    unhideable: true,
  },
  {
    name: 'Type',
    prop: 'adTemplateType',
    show: true,
  },
  {
    name: 'Created',
    prop: 'createdAt',
    show: true,
  },
  {
    name: 'Updated',
    prop: 'updatedAt',
    show: true,
  },
  {
    name: 'Preview',
    prop: 'preview',
    show: true,
    width: '100px',
  },
];

// ! Audience Creation Form Fields
const generateFakeAudiences = (start: number, end: number, prefix = '') => {
  const outputArr = [];
  for (let i = start; i < end; i++) {
    outputArr.push(prefix + i);
  }
  return outputArr;
};
export const audienceFormFields = [
  ['Select Custom Audiences', generateFakeAudiences(1, 15, 'Some Audience #'), 24],
  ['Select Inc./Exc.', ['Include', 'Exclude'], 8],
  ['Select Location Directive', ['People living in', 'People recently in', 'People not in', 'People traveling in'], 16],
  ['Select Locations', ['Romania', 'Germany', 'Israel', 'Austria'], 24],
  ['Select Ages', generateFakeAudiences(13, 65), 8],
  ['Select Gender', ['All', 'Male', 'Female'], 8],
  ['Select Languages', ['English', 'German', 'Hebrew', 'Romanian', 'French'], 8],
  ['Select Targeting Options', generateFakeAudiences(1, 40, 'Some Targeting #'), 24],
  ['Select Custom Connections', ['People who liked your page', 'Friends of people who liked your page'], 24],
];

// ! Optimization goals
// Billing events - https://developers.facebook.com/docs/marketing-api/bidding/overview/billing-events/#buying-type-validation
// OptiGoals - https://developers.facebook.com/docs/marketing-api/bidding/overview#opt-goal-validation

export const optimizationGoals = [
  {
    id: 'LINK_CLICKS',
    name: 'Link Clicks',
    enabledFor: ['APP_INSTALLS', 'CONVERSIONS', 'LINK_CLICKS', 'POST_ENGAGEMENT', 'PRODUCT_CATALOG_SALES'],
    billingEvents: [
      { id: 'IMPRESSIONS', name: 'IMPRESSIONS' },
      { id: 'LINK_CLICKS', name: 'Link Clicks' },
    ],
  },
  {
    id: 'IMPRESSIONS',
    name: 'Impressions',
    enabledFor: [
      'APP_INSTALLS',
      'CONVERSIONS',
      'EVENT_RESPONSES',
      'LINK_CLICKS',
      'MESSAGES',
      'POST_ENGAGEMENT',
      'PRODUCT_CATALOG_SALES',
    ],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'LEAD_GENERATION',
    name: 'Lead Generation',
    enabledFor: ['LEAD_GENERATION'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'QUALITY_LEAD',
    name: 'Quality Lead',
    enabledFor: ['LEAD_GENERATION'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'LANDING_PAGE_VIEWS',
    name: 'Landing Page Views',
    enabledFor: ['CONVERSIONS', 'LINK_CLICKS'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'REACH',
    name: 'Daily Unique Reach',
    enabledFor: ['BRAND_AWARENESS', 'POST_ENGAGEMENT', 'RESEARCH_POLL', 'REACH', 'EVENT_RESPONSES'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'OFFSITE_CONVERSIONS',
    name: 'Conversions',
    enabledFor: ['CONVERSIONS', 'APP_INSTALLS', 'PRODUCT_CATALOG_SALES'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'THRUPLAY',
    name: 'Thruplay',
    enabledFor: ['VIDEO_VIEWS'],
    billingEvents: [
      { id: 'IMPRESSIONS', name: 'IMPRESSIONS' },
      { id: 'THRUPLAY', name: 'THRUPLAY' },
    ],
  },
  {
    id: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS',
    name: 'Two second continuous video views',
    enabledFor: ['VIDEO_VIEWS'],
    billingEvents: [
      { id: 'IMPRESSIONS', name: 'IMPRESSIONS' },
      { id: 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS', name: 'TWO SECOND CONTINUOUS VIDEO VIEWS' },
    ],
  },
  {
    id: 'AD_RECALL_LIFT',
    name: 'Ad recall lift',
    enabledFor: ['BRAND_AWARENESS'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'POST_ENGAGEMENT',
    name: 'Post engagement',
    enabledFor: ['POST_ENGAGEMENT', 'EVENT_RESPONSES'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
  {
    id: 'PAGE_LIKES',
    name: 'Page Likes',
    enabledFor: ['PAGE_LIKES'],
    billingEvents: [
      { id: 'IMPRESSIONS', name: 'IMPRESSIONS' },
      { id: 'PAGE_LIKES', name: 'PAGE LIKES' },
    ],
  },
  {
    id: 'EVENT_RESPONSES',
    name: 'Event Responses',
    enabledFor: ['EVENT_RESPONSES'],
    billingEvents: [{ id: 'IMPRESSIONS', name: 'IMPRESSIONS' }],
  },
];
export const biddingStrategies = [
  { id: FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP, name: 'Lowest Cost', disabled: false },
  { id: FacebookBidStrategyEnum.LOWEST_COST_WITH_BID_CAP, name: 'Bid Cap', disabled: false },
  { id: FacebookBidStrategyEnum.COST_CAP, name: 'Cost Cap', disabled: false },
];

export const facebookConnections = {
  pages: [
    { value: FacebookConnections.CONNECTIONS, label: 'People who liked your page' },
    { value: FacebookConnections.FRIENDS_OF_CONNECTIONS, label: 'Friends of people who liked your page' },
    { value: FacebookConnections.EXCLUDED_CONNECTIONS, label: 'Exclude people who liked your page' },
  ],
};

export const campaignCreationErrorTypes = {
  CAMPAIGN_ERROR: "Campaign couldn't be created",
  ADSET_ERROR: "AdSet couldn't be created",
  AD_ERROR: "The ads couldn't be created",
  CAMPAIGN_NOT_DELETED: "Campaign couldn't be deleted",
};

export const conversionEvents = [
  'RATE',
  'TUTORIAL_COMPLETION',
  'CONTACT',
  'CUSTOMIZE_PRODUCT',
  'DONATE',
  'FIND_LOCATION',
  'SCHEDULE',
  'START_TRIAL',
  'SUBMIT_APPLICATION',
  'SUBSCRIBE',
  'ADD_TO_CART',
  'ADD_TO_WISHLIST',
  'INITIATED_CHECKOUT',
  'ADD_PAYMENT_INFO',
  'PURCHASE',
  'LEAD',
  'COMPLETE_REGISTRATION',
  'CONTENT_VIEW',
  'SEARCH',
  'SERVICE_BOOKING_REQUEST',
  'MESSAGING_CONVERSATION_STARTED_7D',
  'LEVEL_ACHIEVED',
  'ACHIEVEMENT_UNLOCKED',
  'SPENT_CREDITS',
  'LISTING_INTERACTION',
  'D2_RETENTION',
  'D7_RETENTION',
  'OTHER',
];
