import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsPageComponent } from './campaigns-page.component';

const routes: Routes = [{ path: '', component: CampaignsPageComponent, data: { title: 'Campaigns' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsPageRoutingModule {}
