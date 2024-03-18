import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetingModalTriggerComponent } from './targeting-edit/targeting-modal-trigger.component';
import { TargetingResolver } from './targeting.resolver';
import { AudienceResolver } from './audience.resolver';
import { SavedAudienceModalTriggerComponent } from './saved-audience-edit/saved-audience-modal-trigger.component';
import { WebsiteAudienceModalTriggerComponent } from './website-audience-edit/website-audience-modal-trigger.component';

const routes: Routes = [
  {
    path: 'targeting/:id',
    resolve: { targeting: TargetingResolver },
    component: TargetingModalTriggerComponent,
  },
  {
    path: 'savedAudience/:id',
    resolve: { targeting: AudienceResolver },
    component: SavedAudienceModalTriggerComponent,
  },
  {
    path: 'websiteAudience/:id',
    resolve: { targeting: AudienceResolver },
    component: WebsiteAudienceModalTriggerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceOperationRoutingModule {}
