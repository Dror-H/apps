import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceDashboardComponent } from './workspace-dashboard.component';

const routes: Routes = [{ path: '', component: WorkspaceDashboardComponent, data: { title: 'Workspace Dashboard' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceDashboardRoutingModule {}
