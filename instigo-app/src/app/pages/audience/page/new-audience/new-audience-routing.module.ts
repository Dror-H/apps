import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewAudienceComponent } from './new-audience/new-audience.component';

const routes: Routes = [{ path: '', component: NewAudienceComponent, data: { title: 'New Audience' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewAudienceRoutingModule {}
