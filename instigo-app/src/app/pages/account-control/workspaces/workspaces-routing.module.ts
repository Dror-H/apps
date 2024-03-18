import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from './components/workspace-list/workspace-list.component';
import { WorkspaceDetailsComponent } from './workspace-details/workspace-details.component';

const routes: Routes = [
  { path: '', component: WorkspaceListComponent, data: { title: 'Workspaces' } },
  { path: 'details/:workspaceId', component: WorkspaceDetailsComponent, data: { title: 'Workspace Settings' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacesRoutingModule {}
