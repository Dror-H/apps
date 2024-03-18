import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAdAccountGuard } from '@app/global/no-adaccount.guard';
import { SubscriptionGuard } from '@app/global/subscription.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard/adaccount' },
  {
    path: 'dashboard/workspace',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () =>
      import('./workspace-dashboard/workspace-dashboard.module').then((m) => m.WorkspaceDashboardModule),
  },
  {
    path: 'dashboard/adaccount',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () =>
      import('./adaccount-dashboard/adaccount-dashboard.module').then((m) => m.AdAccountDashboardModule),
  },
  {
    path: 'campaign-details',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./campaign-details/campaign-details.module').then((m) => m.CampaignDetailsModule),
  },
  {
    path: 'campaigns',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./campaigns/page/campaigns-page.module').then((m) => m.CampaignsPageModule),
  },
  {
    path: 'audiences',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./audience/audience.module').then((m) => m.AudienceModule),
  },
  {
    path: 'ad-templates',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./ad-template/ad-template.module').then((m) => m.AdTemplateModule),
  },
  {
    path: 'account-control',
    loadChildren: () => import('./account-control/account-control.module').then((m) => m.AccountControlModule),
  },
  {
    path: 'campaign-draft',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./campaign-draft/campaign-draft.module').then((m) => m.CampaignDraftModule),
  },
  {
    path: 'new-campaign',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./new-campaign/new-campaign-layout.module').then((m) => m.NewCampaignLayoutModule),
  },
  {
    path: 'leadgen-form',
    canActivate: [SubscriptionGuard, NoAdAccountGuard],
    loadChildren: () => import('./leadgen-form/leadgen-form.module').then((m) => m.LeadgenFormModule),
  },
  {
    path: 'knowledgebase',
    loadChildren: () => import('./knowledgebase/knowledgebase.module').then((m) => m.KnowledgebaseModule),
  },
  {
    path: 'no-adaccount',
    loadChildren: () => import('./no-adaccount/no-adaccount.module').then((m) => m.NoAdAccountModule),
  },
  {
    path: '404',
    loadChildren: () => import('./page404/page404.module').then((m) => m.Page404Module),
  },
  {
    path: '500',
    loadChildren: () => import('./page500/page500.module').then((m) => m.Page500Module),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
