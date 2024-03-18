import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignDraftComponent } from '@app/pages/campaign-draft/campaign-draft.component';
import { LeadgenFormComponent } from './leadgen-form.component';

const routes: Routes = [{ path: '', component: LeadgenFormComponent, data: { title: 'Lead Forms' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadgenFormRoutingModule {}
