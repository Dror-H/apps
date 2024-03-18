import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdTemplateModalTriggerComponent } from './ad-template-modal-trigger.component';
import { AdTemplateResolver } from './ad-template.resolver';

const routes: Routes = [
  { path: 'create', component: AdTemplateModalTriggerComponent },
  { path: 'edit/:id', resolve: { adTemplate: AdTemplateResolver }, component: AdTemplateModalTriggerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdTemplateOperationRoutingModule {}
