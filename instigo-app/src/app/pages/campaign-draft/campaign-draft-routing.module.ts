import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignDraftComponent } from '@app/pages/campaign-draft/campaign-draft.component';

const routes: Routes = [{ path: '', component: CampaignDraftComponent, data: { title: 'Campaign Drafts' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignDraftRoutingModule {}
