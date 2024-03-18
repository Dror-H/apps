import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { WorkspaceCardComponent } from './workspace-card.component';

@NgModule({
  declarations: [WorkspaceCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzDropDownModule,
    NzProgressModule,
    NzAvatarModule,
    NzToolTipModule,
  ],
  exports: [WorkspaceCardComponent],
})
export class WorkspaceCardModule {}
