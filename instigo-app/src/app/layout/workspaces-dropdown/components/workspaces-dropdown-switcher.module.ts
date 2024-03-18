import { NgModule } from '@angular/core';
import { WorkspacesDropdownSwitcherComponent } from './workspaces-dropdown-switcher.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WorkspacesDropdownSwitcherComponent],
  imports: [NzDropDownModule, CommonModule, RouterModule],
  exports: [WorkspacesDropdownSwitcherComponent],
})
export class WorkspacesDropdownSwitcherModule {}
