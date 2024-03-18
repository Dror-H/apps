import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountControlComponent } from './components/account-control.component';
import { OwnerGuard } from '@app/security/owner.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
  {
    path: '',
    component: AccountControlComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
        data: {
          breadCrumb: {
            title: 'Account Control',
          },
        },
      },
      {
        path: 'account-security',
        loadChildren: () => import('./account-security/account-security.module').then((m) => m.AccountSecurityModule),
        data: {
          breadCrumb: {
            title: 'Account Security',
          },
        },
      },
      {
        path: 'workspaces',
        loadChildren: () => import('./workspaces/workspaces.module').then((m) => m.WorkspacesModule),
        data: {
          breadCrumb: {
            title: 'Workspaces',
          },
        },
      },
      {
        path: 'subscription',
        loadChildren: () => import('./subscription/subscription.module').then((m) => m.SubscriptionModule),
        data: {
          breadCrumb: {
            title: 'Subscriptions',
          },
        },
      },
      {
        path: 'invoices',
        canActivate: [OwnerGuard],
        loadChildren: () => import('./invoices/invoices.module').then((m) => m.InvoicesModule),
        data: {
          breadCrumb: {
            title: 'Invoices',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountControlRoutingModule {}
