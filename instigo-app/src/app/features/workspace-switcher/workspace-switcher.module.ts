import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { WorkspaceSwitcherComponent } from './workspace-switcher.component';

@NgModule({
  declarations: [WorkspaceSwitcherComponent],
  imports: [CommonModule, NzCardModule],
  exports: [WorkspaceSwitcherComponent],
  providers: [],
})
export class WorkspaceSwitcherModule {}
