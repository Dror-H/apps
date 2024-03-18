import { BreakdownTypes, ConversionTypes } from '../../../../global/constants';

export const breakdownsTableConfig = [
  {
    label: 'Breakdown',
    prop: 'breakdown',
    width: 350,
    firstCol: true,
    truncate: 35,
  },
  {
    label: 'Spend',
    prop: 'spend',
    width: 125,
    type: 'currency',
  },
  {
    label: 'Impressions',
    prop: 'impressions',
    width: 125,
    type: 'number',
  },
  {
    label: 'Reach',
    prop: 'reach',
    width: 125,
    type: 'number',
  },
  {
    label: 'Clicks',
    prop: 'clicks',
    width: 125,
    type: 'number',
  },
  {
    label: 'Conversions',
    prop: 'conversions',
    width: 125,
  },
  {
    label: 'CPA',
    prop: 'cpa',
    width: 125,
    type: 'currency',
  },
  {
    label: 'CPP',
    prop: 'cpp',
    width: 125,
    type: 'currency',
  },
  {
    label: 'CPM',
    prop: 'cpm',
    width: 125,
    type: 'currency',
  },
  {
    label: 'CPC',
    prop: 'cpc',
    width: 125,
    type: 'currency',
  },
  {
    label: 'CTR',
    prop: 'ctr',
    width: 125,
    type: 'percentage',
  },
  {
    label: 'Frequency',
    prop: 'frequency',
    width: 125,
    type: 'number',
  },
] as BreakdownsDetailsConfigInterface[];

export interface BreakdownsDetailsConfigInterface {
  prop: string;
  label: string;
  width?: number;
  firstCol?: boolean;
  truncate?: number;
  type?: 'currency' | 'percentage' | 'status' | 'number';
}

export const breakdownOptions = {
  country: {
    label: 'Country',
    value: 'country',
    param: [BreakdownTypes.country],
  },
  region: {
    label: 'Region',
    value: 'region',
    param: [BreakdownTypes.region],
  },
  countryAndRegion: {
    label: 'Country & Region',
    value: 'countryAndRegion',
    param: [BreakdownTypes.country, BreakdownTypes.region],
  },
  age: {
    label: 'Age',
    value: 'age',
    param: [BreakdownTypes.age],
  },
  ageAndGender: {
    label: 'Age & Gender',
    value: 'ageAndGender',
    param: [BreakdownTypes.age, BreakdownTypes.gender],
  },
  device: {
    label: 'Device',
    value: 'device',
    param: [BreakdownTypes.device],
  },
  deviceAndPlacement: {
    label: 'Device & Placement',
    value: 'deviceAndPlacement',
    param: [BreakdownTypes.device, BreakdownTypes.placement],
  },
  hourlyRange: {
    label: 'Time',
    value: 'hourlyRange',
    param: [BreakdownTypes.hourlyRange],
  },
};

export const conversionOptions = {
  [ConversionTypes.video_view]: {
    label: 'Video view',
    value: ConversionTypes.video_view,
  },
  [ConversionTypes.post_engagement]: {
    label: 'Post engagement',
    value: ConversionTypes.post_engagement,
  },
  [ConversionTypes.page_engagement]: {
    label: 'Page engagement',
    value: ConversionTypes.page_engagement,
  },
  [ConversionTypes.landing_page_view]: {
    label: 'Landing page view',
    value: ConversionTypes.landing_page_view,
  },
  [ConversionTypes.link_click]: {
    label: 'Link click',
    value: ConversionTypes.link_click,
  },
};
