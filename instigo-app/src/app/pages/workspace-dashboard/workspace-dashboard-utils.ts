import { format, formatDistance, parseJSON } from 'date-fns';

export const providerMetricsTypes = {
  spend: {
    name: 'Spend',
    emoji: '🍎',
    type: 'currency',
    message: {
      facebook: 'app.workspaceMetrics.facebook.spend',
      linkedin: 'app.workspaceMetrics.linkedin.spend',
    },
  },
  clicks: {
    name: 'Clicks',
    emoji: '🍑',
    message: {
      facebook: 'app.workspaceMetrics.facebook.clicks',
      linkedin: 'app.workspaceMetrics.linkedin.clicks',
    },
  },
  impressions: {
    name: 'Impressions',
    emoji: '🍉',
    type: 'shortNumber',
    message: {
      facebook: 'app.workspaceMetrics.facebook.impressions',
      linkedin: 'app.workspaceMetrics.linkedin.impressions',
    },
  },
  reach: {
    name: 'Reach',
    emoji: '🍋',
    type: 'shortNumber',
    message: {
      facebook: 'app.workspaceMetrics.facebook.reach',
      linkedin: 'app.workspaceMetrics.linkedin.reach',
    },
  },
  socialSpend: {
    name: 'Social Spend',
    emoji: '🍐',
    type: 'currency',
    message: {
      facebook: 'app.workspaceMetrics.facebook.socialSpend',
      linkedin: 'app.workspaceMetrics.linkedin.socialSpend',
    },
  },
  cpm: {
    name: 'CPM',
    emoji: '🍇',
    type: 'currency',
    message: {
      facebook: 'app.workspaceMetrics.facebook.cpm',
      linkedin: 'app.workspaceMetrics.linkedin.cpm',
    },
  },
  cpc: {
    name: 'CPC',
    emoji: '🍓',
    type: 'currency',
    message: {
      facebook: 'app.workspaceMetrics.facebook.cpc',
      linkedin: 'app.workspaceMetrics.linkedin.cpc',
    },
  },
  ctr: {
    name: 'CTR',
    emoji: '🫐',
    type: 'percentage',
    message: {
      facebook: 'app.workspaceMetrics.facebook.ctr',
      linkedin: 'app.workspaceMetrics.linkedin.ctr',
    },
  },
  frequency: {
    name: 'Frequency',
    emoji: '🥝',
    message: {
      facebook: 'app.workspaceMetrics.facebook.frequency',
      linkedin: 'app.workspaceMetrics.linkedin.frequency',
    },
  },
  uniqueClicks: {
    name: 'Unique Clicks',
    emoji: '🥕',
    message: {
      facebook: 'app.workspaceMetrics.facebook.uniqueClicks',
      linkedin: 'app.workspaceMetrics.linkedin.uniqueClicks',
    },
  },
};
export const facebookActivityTypes = {
  ad_review_approved: { type: 'success', icon: 'layer-plus' },
  ad_review_declined: { type: 'fail', icon: 'layer-minus' },
  ad_account_set_business_information: { type: 'action', icon: 'business-time' },
  ad_account_update_status: { type: 'warning', icon: 'toggle-on' },
  ad_account_add_user_to_role: { type: 'warning', icon: 'users-cog' },
  ad_account_remove_user_from_role: { type: 'warning', icon: 'users-cog' },
  add_images: { type: 'action', icon: 'photo-video' },
  edit_images: { type: 'action', icon: 'photo-video' },
  create_ad: { type: 'success', icon: 'pencil-paintbrush' },
  update_ad_creative: { type: 'action', icon: 'pencil-paintbrush' },
  update_ad_friendly_name: { type: 'action', icon: 'pencil-paintbrush' },
  update_ad_run_status: { type: 'action', icon: 'toggle-on' },
  update_ad_run_status_to_be_set_after_review: { type: 'action', icon: 'toggle-on' },
  update_ad_set_ad_keywords: { type: 'action', icon: 'layer-plus' },
  create_ad_set: { type: 'success', icon: 'layer-plus' },
  update_ad_set_bidding: { type: 'action', icon: 'funnel-dollar' },
  update_ad_set_bid_strategy: { type: 'action', icon: 'funnel-dollar' },
  update_ad_set_bid_adjustments: { type: 'action', icon: 'funnel-dollar' },
  update_ad_set_budget: { type: 'action', icon: 'funnel-dollar' },
  update_ad_set_duration: { type: 'action', icon: 'clock' },
  update_ad_set_name: { type: 'action', icon: 'layer-plus' },
  update_ad_set_run_status: { type: 'action', icon: 'toggle-on' },
  update_ad_set_target_spec: { type: 'action', icon: 'users' },
  create_audience: { type: 'action', icon: 'users-medical' },
  update_audience: { type: 'action', icon: 'users-medical' },
  delete_audience: { type: 'warning', icon: 'users-slash' },
  share_audience: { type: 'info', icon: 'users' },
  receive_audience: { type: 'info', icon: 'check' },
  unshare_audience: { type: 'info', icon: 'users-slash' },
  remove_shared_audience: { type: 'warning', icon: 'users-slash' },
  update_adgroup_stop_delivery: { type: 'warning', icon: 'toggle-off' },
  update_ad_bid_info: { type: 'action', icon: 'funnel-dollar' },
  update_ad_bid_type: { type: 'action', icon: 'funnel-dollar' },
  ad_account_billing_charge: { type: 'info', icon: 'file-invoice-dollar' },
  ad_account_billing_chargeback: { type: 'info', icon: 'file-invoice-dollar' },
  ad_account_billing_chargeback_reversal: { type: 'success', icon: 'file-invoice-dollar' },
  ad_account_billing_decline: { type: 'fail', icon: 'file-invoice-dollar' },
  ad_account_billing_refund: { type: 'info', icon: 'file-invoice-dollar' },
  ad_account_remove_spend_limit: { type: 'action', icon: 'funnel-dollar' },
  ad_account_reset_spend_limit: { type: 'action', icon: 'funnel-dollar' },
  ad_account_update_spend_limit: { type: 'action', icon: 'funnel-dollar' },
  add_funding_source: { type: 'action', icon: 'credit-card-front' },
  billing_event: { type: 'info', icon: 'file-invoice-dollar' },
  funding_event_initiated: { type: 'action', icon: 'credit-card-front' },
  funding_event_successful: { type: 'success', icon: 'credit-card-front' },
  remove_funding_source: { type: 'info', icon: 'credit-card-front' },
  update_campaign_budget: { type: 'action', icon: 'funnel-dollar' },
  update_campaign_group_spend_cap: { type: 'action', icon: 'funnel-dollar' },
  create_campaign_legacy: { type: 'success', icon: 'folder-plus' },
  create_campaign_group: { type: 'success', icon: 'folder-plus' },
  update_campaign_duration: { type: 'action', icon: 'clock' },
  update_campaign_name: { type: 'action', icon: 'comment-alt-edit' },
  update_campaign_run_status: { type: 'action', icon: 'toggle-on' },
  update_ad_targets_spec: { type: 'action', icon: 'users' },
};

export interface mainChartMetrics {
  metric: any;
  axis: string;
  colors: any;
  gradient: any;
  special?: string;
  hidden?: boolean;
  prefix?: string;
  suffix?: string;
}
export interface WorkspaceActivityType {
  type: string;
  icon: string;
}
export interface WorkspaceActivity {
  actor: string;
  actorShort: string;
  actorInitials: string;
  message: string;
  time: string;
  relativeTime: string;
  fullMessage: string;
  objectType: string;
  objectName: string;
  platform: string;
  type: WorkspaceActivityType;
  read: boolean;
  raw?: any;
  deleted?: boolean;
}
export interface WorkspaceProviderMetric {
  id: number;
  provider: string;
  metric: string;
  summary: number;
  versus: number;
  active: boolean;
  hidden?: boolean;
}
export interface WorkspaceCardData {
  name: string;
  linkedinCount: number;
  facebookCount: number;
  created: string;
  updated: string;
  initials: string;
  isActive: string;
  adAccountsCount: number;
  adAccountsLimit: number;
  managedBy: string;
  subscription: any;
}

export function userInitials(user): string {
  return user
    .match(/(\b\S)?/g)
    .join('')
    .match(/(^\S|\S$)?/g)
    .join('')
    .toUpperCase();
}

export function prepActivity(activityItem: any): WorkspaceActivity {
  const metadata = activityItem.providerMetadata;
  const fullName = metadata?.actor_name.split(' ') || '';
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const initials = fullName[fullName.length - 1]?.substring(0, 1)?.toUpperCase() + '.';
  const message = metadata?.translated_event_type.split(' ');
  const action = message?.pop();
  return {
    actor: metadata?.actor_name || '',
    actorShort: `${fullName[0]} ${initials}`,
    actorInitials: userInitials(metadata?.actor_name || ''),
    message: `${action} ${message?.join(' ').toLowerCase()}`,
    fullMessage: activityItem.description || metadata?.translated_event_type || '',
    time: format(parseJSON(metadata?.event_time || new Date()), "eee, MMM do y 'at' HH:mm") || '',
    relativeTime: formatDistance(parseJSON(metadata?.event_time || new Date()), new Date(), { addSuffix: true }),
    objectName: metadata?.object_name,
    objectType: metadata?.object_type,
    platform: metadata?.application_name?.includes('Instigo') ? 'Instigo' : 'Facebook Ads Manager',
    type: facebookActivityTypes[metadata?.event_type] || { type: 'info', icon: 'check' },
    read: activityItem.read,
    raw: activityItem,
  };
}
