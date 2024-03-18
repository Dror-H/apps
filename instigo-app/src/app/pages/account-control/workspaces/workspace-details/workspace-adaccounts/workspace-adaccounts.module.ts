import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { WorkspaceAdAccountsComponent } from './workspace-adaccounts.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [WorkspaceAdAccountsComponent],
  imports: [
    CommonModule,
    DataTableModule,
    NzPopconfirmModule,
    NzCardModule,
    NzToolTipModule,
    NzInputModule,
    NzButtonModule,
  ],
  exports: [WorkspaceAdAccountsComponent],
})
export class WorkspaceAdaccountsModule {}
