import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WorkspaceForsakingComponent } from './workspace-forsaking.component';

@NgModule({
  declarations: [WorkspaceForsakingComponent],
  imports: [CommonModule, FormsModule, NzModalModule, NzButtonModule, NzCardModule],
  exports: [WorkspaceForsakingComponent],
})
export class WorkspaceForsakingModule {}
