import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudiencesPageComponent } from './audiences-page.component';

const routes: Routes = [{ path: '', component: AudiencesPageComponent, data: { title: 'Audiences' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudiencesPageRoutingModule {}
