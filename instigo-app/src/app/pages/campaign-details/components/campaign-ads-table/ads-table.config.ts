export const adsTableConfig = [
  {
    label: 'Name',
    prop: 'name',
    width: 350,
    firstCol: true,
    truncate: 35,
  },
  {
    label: 'Status',
    prop: 'status',
    width: 80,
    type: 'status',
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
    type: 'number',
  },
  {
    label: 'Conv. Rate',
    prop: 'conversionsRate',
    width: 125,
    type: 'number',
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
    label: 'CPA',
    prop: 'cpa',
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
    type: 'percentage',
  },
  {
    label: 'Engagements',
    prop: 'totalEngagements',
    width: 125,
    type: 'number',
  },
] as AdsTableConfigInterface[];

export interface AdsTableConfigInterface {
  prop: string;
  label: string;
  width?: number;
  firstCol?: boolean;
  truncate?: number;
  type?: 'currency' | 'percentage' | 'status' | 'number';
}
