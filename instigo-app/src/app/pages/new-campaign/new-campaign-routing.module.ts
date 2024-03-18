import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookNewCampaignComponent } from './facebook-new-campaign/facebook-new-campaign.component';
import { LinkedinNewCampaignComponent } from './linkedin-new-campaign/linkedin-new-campaign.component';
import { NewCampaignLayoutComponent } from './new-campaign-layout.component';
import { NewCampaignResolver } from '@app/pages/new-campaign/new-campaign.resolver';
import { FeatureToggleGuard } from '@app/shared/feature-toggle/feature-toggle.guard';

const routes: Routes = [
  {
    path: '',
    component: NewCampaignLayoutComponent,
    data: { title: 'New Campaign' },
    children: [
      {
        path: 'facebook',
        component: FacebookNewCampaignComponent,
      },
      {
        path: 'facebook/:id',
        resolve: [NewCampaignResolver],
        component: FacebookNewCampaignComponent,
      },
      {
        path: 'linkedin',
        component: LinkedinNewCampaignComponent,
        canActivate: [FeatureToggleGuard],
        data: { feature: 'linkedinCampaign' },
      },
      {
        path: 'linkedin/:id',
        resolve: [NewCampaignResolver],
        component: LinkedinNewCampaignComponent,
        canActivate: [FeatureToggleGuard],
        data: { feature: 'linkedinCampaign' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCampaignRoutingModule {}
