import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { WorkspaceEditableInfoComponent } from './workspace-editable-info.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [WorkspaceEditableInfoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
    NzSelectModule,
  ],
  providers: [],
  exports: [WorkspaceEditableInfoComponent],
})
export class WorkspaceEditableInfoModule {}
