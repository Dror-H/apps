import { AdAccountDTO } from '@instigo-app/data-transfer-object';

export const providerIcons = {
  facebook: 'ng-fa-icon fab fa-facebook-f',
  google: 'ng-fa-icon fab fa-google',
  linkedin: 'ng-fa-icon fab fa-linkedin-in',
  tiktok: 'ng-fa-icon fas fa-magic',
  twitter: 'ng-fa-icon fab fa-twitter',
};

export const providerSquareIcons = {
  facebook: 'ng-fa-icon fab fa-facebook-square',
  google: 'ng-fa-icon fab fa-google',
  linkedin: 'ng-fa-icon fab fa-linkedin',
  tiktok: 'ng-fa-icon fas fa-magic',
  twitter: 'ng-fa-icon fab fa-twitter-square',
};

export const providerColors = {
  facebook: '#3B5998',
  google: '#3CBA54',
  linkedin: '#0E76A8',
  tiktok: '#2A3042',
  twitter: '#00ACEE',
};

export enum MemberStatus {
  ACTIVE = 'Active',
  INPENDING = 'Pending',
}

export const CampaignStatusIcons = {
  ACTIVE: 'fas fa-play',
  PAUSED: 'fas fa-pause',
  COMPLETED: 'fas fa-check',
  INREVIEW: 'fas fa-file-contract',
  DRAFT: 'fas fa-pencil-ruler',
  ARCHIVED: 'fas fa-archive',
};

export enum DatePresetTypes {
  custom = 'custom',
  last7Days = 'last_7d',
  last30Days = 'last_30d',
  last90Days = 'last_90d',
  this_year = 'this_year',
  this_week = 'this_week',
  this_month = 'this_month',
  last_year = 'last_year',
  lifetime = 'lifetime',
}

export enum BreakdownTypes {
  country = 'country',
  region = 'region',
  countryAndRegion = 'country,region',
  age = 'age',
  gender = 'gender',
  device = 'device_platform',
  placement = 'publisher_platform',
  hourlyRange = 'hourly_stats_aggregated_by_audience_time_zone',
}

export enum ConversionTypes {
  video_view = 'video_view',
  post_engagement = 'post_engagement',
  page_engagement = 'page_engagement',
  landing_page_view = 'landing_page_view',
  link_click = 'link_click',
}

export interface ChartType {
  labels?: any;
  datasets?: any;
  options?: any;
  legend?: boolean;
  chartType?: string;
  chartData?: any;
}

export interface ChartData {
  labels?: any;
  dataset?: any;
  options?: any;
}

export interface TargetingDisplay {
  providerId?: string;
  adAccountId?: string;
  adAccount?: AdAccountDTO;
  targetSize: number;
  id: string;
  name: string;
  age: string;
  gender: string;
  languages: string;
  locationType?: string;
  includedLocations?: any[];
  excludedLocations?: any[];
  includedCusAudiences?: any[];
  excludedCusAudiences?: any[];
  placements?: any[] | string;
  active?: boolean;
  rules: any;
  detailed?: {
    included: any[];
    narrow: any[];
    excluded: any[];
  };
}
