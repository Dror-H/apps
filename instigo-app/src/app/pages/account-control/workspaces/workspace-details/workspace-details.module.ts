import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { WorkspaceAdaccountsModule } from './workspace-adaccounts/workspace-adaccounts.module';
import { WorkspaceDeletionModule } from './workspace-deletion/workspace-deletion.module';
import { WorkspaceDetailsComponent } from './workspace-details.component';
import { WorkspaceEditableInfoModule } from './workspace-editable-info/workspace-editable-info.module';
import { WorkspaceForsakingModule } from './workspace-forsaking/workspace-forsaking.module';
import { WorkspaceIntegrationsModule } from './workspace-integrations/workspace-integrations.module';
import { WorkspaceMembersModule } from './workspace-members/workspace-members.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [WorkspaceDetailsComponent],
  imports: [
    CommonModule,
    WorkspaceIntegrationsModule,
    WorkspaceEditableInfoModule,
    WorkspaceMembersModule,
    WorkspaceAdaccountsModule,
    WorkspaceDeletionModule,
    WorkspaceForsakingModule,
    NzButtonModule,
    NzCardModule,
    NzSpinModule,
    NzIconModule,
    NzGridModule,
  ],
  exports: [WorkspaceDetailsComponent],
})
export class WorkspaceDetailsModule {}
