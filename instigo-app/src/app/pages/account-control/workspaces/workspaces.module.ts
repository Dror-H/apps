import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkspaceListModule } from './components/workspace-list/workspace-list.module';
import { WorkspaceDetailsModule } from './workspace-details/workspace-details.module';
import { WorkspacesRoutingModule } from './workspaces-routing.module';

@NgModule({
  imports: [CommonModule, WorkspaceListModule, WorkspaceDetailsModule, WorkspacesRoutingModule],
})
export class WorkspacesModule {}
