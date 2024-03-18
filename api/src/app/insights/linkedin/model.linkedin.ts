import { Resources } from '@instigo-app/data-transfer-object';

export type ProgressType = Resources.CAMPAIGNS | Resources.ADS;

export enum Pivot {
  CREATIVE = 'CREATIVE',
  CAMPAIGN = 'CAMPAIGN',
  MEMBER_INDUSTRY = 'MEMBER_INDUSTRY',
  MEMBER_SENIORITY = 'MEMBER_SENIORITY',
  MEMBER_JOB_TITLE = 'MEMBER_JOB_TITLE',
  MEMBER_JOB_FUNCTION = 'MEMBER_JOB_FUNCTION',
  MEMBER_COUNTRY_V2 = 'MEMBER_COUNTRY_V2',
  MEMBER_REGION_V2 = 'MEMBER_REGION_V2',
  MEMBER_COMPANY = 'MEMBER_COMPANY',
  MEMBER_COMPANY_SIZE = 'MEMBER_COMPANY_SIZE',
}

export enum EntityType {
  sponsoredCreative = 'sponsoredCreative',
  sponsoredCampaign = 'sponsoredCampaign',
  industry = 'industry',
  seniority = 'seniority',
  title = 'title',
  function = 'function',
  geo = 'geo',
  organization = 'organization',
}

export type URN = `urn:li:${EntityType}:${string}`;

export interface LinkedinResponse {
  paging: Paging;
  elements: Element[];
}

export interface Element {
  dateRange: DateRange;
  pivotValue: URN | string;
  pivot: Pivot;
  'pivotValue~': any;
  costInLocalCurrency: string;
  shares: number;
  likes: number;
  comments: number;
  landingPageClicks: number;
  follows: number;
  impressions: number;
  otherEngagements: number;
  externalWebsiteConversions: number;
  clicks: number;
  totalEngagements: number;
  approximateUniqueImpressions: number;
  externalWebsitePostClickConversions: number;
  videoFirstQuartileCompletions: number;
  textUrlClicks: number;
  viralCommentLikes: number;
  cardClicks: number;
  viralComments: number;
  oneClickLeads: number;
  viralOneClickLeadFormOpens: number;
  viralFollows: number;
  viralVideoCompletions: number;
  leadGenerationMailInterestedClicks: number;
  opens: number;
  viralReactions: number;
  viralImpressions: number;
  viralLikes: number;
  viralVideoMidpointCompletions: number;
  viralFullScreenPlays: number;
  videoMidpointCompletions: number;
  viralCardClicks: number;
  viralShares: number;
  videoCompletions: number;
  externalWebsitePostViewConversions: number;
  oneClickLeadFormOpens: number;
  sends: number;
  viralLandingPageClicks: number;
  viralExternalWebsitePostClickConversions: number;
  leadGenerationMailContactInfoShares: number;
  reactions: number;
  adUnitClicks: number;
  companyPageClicks: number;
  viralOneClickLeads: number;
  videoStarts: number;
  viralExternalWebsiteConversions: number;
  videoThirdQuartileCompletions: number;
  viralVideoThirdQuartileCompletions: number;
  fullScreenPlays: number;
  viralCardImpressions: number;
  conversionValueInLocalCurrency: string;
  cardImpressions: number;
  videoViews: number;
  viralVideoViews: number;
  commentLikes: number;
  viralOtherEngagements: number;
  viralExternalWebsitePostViewConversions: number;
  viralTotalEngagements: number;
  viralCompanyPageClicks: number;
  actionClicks: number;
  viralVideoStarts: number;
  costInUsd: string;
  viralVideoFirstQuartileCompletions: number;
  viralClicks: number;
  pivotValues: string[];
}

export interface DateRange {
  start: DatePoint;
  end: DatePoint;
}

export interface DatePoint {
  month: number;
  year: number;
  day: number;
}

export interface Paging {
  count: number;
  start: number;
  links: Link[];
}

export interface Link {
  type?: string;
  rel?: string;
  href: string;
}
