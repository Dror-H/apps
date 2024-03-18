import { NgModule } from '@angular/core';
import { SideNavComponent } from './side-nav.component';
import { WorkspacesDropdownModule } from '@app/layout/workspaces-dropdown/workspaces-dropdown.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [SideNavComponent],
  imports: [
    RouterModule,
    CommonModule,
    WorkspacesDropdownModule,
    UiSharedModule,
    NzMenuModule,
    NzToolTipModule,
    NzAvatarModule,
    NzIconModule,
    NzTagModule,
    NzButtonModule,
  ],
  exports: [SideNavComponent],
})
export class SideNavModule {}
