import { UserDashboardControlListItem } from '@instigo-app/ui/shared';

export const controlCardListItems: UserDashboardControlListItem[] = [
  {
    testId: 'your-account',
    routerLink: './',
    iconClass: 'fal fa-dharmachakra',
    label: 'Your Account',
    matchRouterExact: true,
  },
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
