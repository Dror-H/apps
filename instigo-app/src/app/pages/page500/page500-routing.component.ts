import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page500Component } from './page500.component';

const routes: Routes = [{ path: '', component: Page500Component, data: { title: 'Error' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Page500RoutingModule {}
