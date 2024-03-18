import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { WorkspaceCardModule } from '../workspace-card/workspace-card.module';
import { WorkspaceListComponent } from './workspace-list.component';
import { CreateWorkspaceCardModule } from '@app/features/create-workspace-card/create-workspace-card.module';

@NgModule({
  declarations: [WorkspaceListComponent],
  imports: [CreateWorkspaceCardModule, WorkspaceCardModule, CommonModule, NzGridModule],
  exports: [WorkspaceListComponent],
})
export class WorkspaceListModule {}
