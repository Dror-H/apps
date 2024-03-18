import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WorkspaceDeletionComponent } from './workspace-deletion.component';

@NgModule({
  declarations: [WorkspaceDeletionComponent],
  imports: [CommonModule, FormsModule, NzCollapseModule, NzModalModule, NzButtonModule, NzCardModule],
  exports: [WorkspaceDeletionComponent],
})
export class WorkspaceDeletionModule {}
