import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./page/audiences-page/audiences-page.module').then((m) => m.AudiencesPageModule),
  },
  {
    path: 'new',
    loadChildren: () => import('./page/new-audience/new-audience.module').then((m) => m.NewAudienceModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienceRoutingModule {}
