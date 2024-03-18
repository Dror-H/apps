import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkspacesDropdownComponent } from '@app/layout/workspaces-dropdown/workspaces-dropdown.component';
import { WorkspacesDropdownSwitcherModule } from '@app/layout/workspaces-dropdown/components/workspaces-dropdown-switcher.module';

@NgModule({
  declarations: [WorkspacesDropdownComponent],
  imports: [CommonModule, WorkspacesDropdownSwitcherModule],
  exports: [WorkspacesDropdownComponent],
})
export class WorkspacesDropdownModule {}
