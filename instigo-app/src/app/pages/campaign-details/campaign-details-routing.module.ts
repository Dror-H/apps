import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignDetailsComponent } from './campaign-details.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignDetailsComponent,
    data: { title: 'Campaign Details' },
  },
  {
    path: ':id',
    component: CampaignDetailsComponent,
    data: { title: 'Campaign Details' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignDetailsRoutingModule {}
