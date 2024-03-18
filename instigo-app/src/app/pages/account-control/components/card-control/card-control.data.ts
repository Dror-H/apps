import { UserDashboardControlListItem } from '@instigo-app/ui/shared';

export const workspaceOwnerListItems: UserDashboardControlListItem[] = [
  {
    testId: 'your-subscription',
    routerLink: 'subscription',
    iconClass: 'fal fa-planet-ringed',
    label: 'Your Subscription',
  },
  {
    testId: 'invoices',
    routerLink: 'invoices',
    iconClass: 'fal fa-file-invoice',
    label: 'Invoices History',
  },
];
export const controlCardListItems: UserDashboardControlListItem[] = [
  {
    testId: 'your-account',
    routerLink: 'profile',
    iconClass: 'fal fa-dharmachakra',
    label: 'Your Account',
  },
  {
    testId: 'account-security',
    routerLink: 'account-security',
    iconClass: 'fal fa-shield-alt',
    label: 'Account Security',
  },
  {
    testId: 'workspaces',
    routerLink: 'workspaces',
    iconClass: 'fal fa-briefcase',
    label: 'Workspaces',
  },
];
