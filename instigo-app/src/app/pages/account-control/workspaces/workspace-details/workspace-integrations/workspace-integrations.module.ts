import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdAccountSelectModule } from '@app/features/ad-account-select/ad-account-select.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WorkspaceIntegrationsComponent } from './workspace-integrations.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [WorkspaceIntegrationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzToolTipModule,
    NzButtonModule,
    NzCardModule,
    AdAccountSelectModule,
    NzGridModule,
    NzListModule,
  ],
  exports: [WorkspaceIntegrationsComponent],
})
export class WorkspaceIntegrationsModule {}
