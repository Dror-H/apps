import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdTemplatesPageComponent } from './page/ad-template-page/ad-templates-page.component';
import { NewAdTemplatePageComponent } from './page/new-ad-template-page/new-ad-template-page.component';

const routes: Routes = [
  { path: '', component: AdTemplatesPageComponent, data: { title: 'Ad Templates' } },
  { path: 'new', component: NewAdTemplatePageComponent, data: { title: 'New Ad Template' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdTemplateRoutingModule {}
