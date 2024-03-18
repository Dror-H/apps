import { LinkedinCostType } from '@instigo-app/data-transfer-object';

export const linkedinCampaignObjective = [
  {
    title: 'Brand Awareness',
    short: 'Promote your brand among your target audience',
    desc: 'Send people to a destination, like a website or app.',
    icon: 'fas fa-bullhorn',
    active: false,
    value: 'BRAND_AWARENESS',
    defaultOptimizationGoal: '',
  },
  {
    title: 'Website Visits',
    short: 'Direct people to visit a specific website',
    desc: 'Send people to a destination, like a website or app.',
    icon: 'far fa-browser',
    active: true,
    value: 'WEBSITE_VISIT',
    defaultOptimizationGoal: '',
  },
  {
    title: 'Engagement',
    short: 'Increase the interaction with your content through likes',
    desc: 'Increase the interaction with your content through likes, comments, approvals, clicks on a landing page',
    icon: 'fas fa-comments',
    active: false,
    value: 'ENGAGEMENT',
    defaultOptimizationGoal: '',
  },
  {
    title: 'Video Views',
    short: 'Show video ads to people in your target audience',
    desc: 'Show people video ads.',
    icon: 'fas fa-camera-movie',
    value: 'VIDEO_VIEW',
    active: false,
    defaultOptimizationGoal: '',
  },
  {
    title: 'Lead Generation',
    short: 'Collect leads and prospects for your business or brand',
    desc: 'Collect leads for your business or brand.',
    icon: 'fas fa-user-tie',
    value: 'LEAD_GENERATION',
    active: false,
    defaultOptimizationGoal: 'LEAD_GENERATION',
  },
  {
    title: 'Website Conversions',
    short: 'Show ads to people who are likely to take action',
    desc: 'Show your ads to people most likely to take valuable actions, like making a purchase or adding payment info, on your website or app.',
    icon: 'fas fa-bags-shopping',
    active: false,
    value: 'WEBSITE_CONVERSION',
    defaultOptimizationGoal: '',
  },
  {
    title: 'Job Applicant',
    short: 'Promote your job offers to the best candidates',
    desc: 'Show your ads to people by selecting "Applicants" as your advertising target.',
    icon: 'fas fa-users',
    active: false,
    value: 'JOB_APPLICANT',
    defaultOptimizationGoal: '',
  },
  {
    title: 'Talent Lead',
    short: 'Target candidates interested in your company',
    desc: 'Build a pipeline of talent interested in your company by choosing the Talent Leads ad objective.',
    icon: 'fas fa-crosshairs',
    active: false,
    value: 'TALENT_LEAD',
    defaultOptimizationGoal: '',
  },
];

export const linkedinCostTypeNzOptions = [
  { value: LinkedinCostType.CPC, label: 'CPC' },
  { value: LinkedinCostType.CPM, label: 'CPM' },
  { value: LinkedinCostType.CPV, label: 'CPV' },
];

export enum LinkedinAudienceSource {
  CREATE_NEW_AUDIENCES,
  LOAD_AUDIENCES,
}

export const linkedinAudienceSourceOptions = [
  {
    id: LinkedinAudienceSource.CREATE_NEW_AUDIENCES,
    title: 'Create New Audiences',
    available: false,
  },
  {
    id: LinkedinAudienceSource.LOAD_AUDIENCES,
    title: 'Load Saved Audiences',
    available: true,
  },
];

export const overviewSections = [
  {
    id: 'campaign',
    name: 'Campaign',
    icon: 'newcamp-ov-1.png',
    subSections: [
      { formControl: 'settings.account', name: 'Ad Account' },
      { formControl: 'settings.campaignGroup', name: 'Campaign Group' },
      { formControl: 'settings.name', name: 'Campaign Name' },
      { formControl: 'settings.objective', name: 'Objective' },
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
];
