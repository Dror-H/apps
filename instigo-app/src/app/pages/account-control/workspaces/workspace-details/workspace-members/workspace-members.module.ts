import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { WorkspaceMembersComponent } from './workspace-members.component';

@NgModule({
  declarations: [WorkspaceMembersComponent],
  imports: [
    DataTableModule,
    CommonModule,
    FormsModule,
    NzCardModule,
    NzToolTipModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule,
  ],
  exports: [WorkspaceMembersComponent],
})
export class WorkspaceMembersModule {}
