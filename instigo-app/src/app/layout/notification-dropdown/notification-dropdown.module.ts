import { NgModule } from '@angular/core';
import { NotificationDropdownComponent } from './notification-dropdown.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NotificationDropdownComponent],
  imports: [RouterModule, CommonModule, NzDropDownModule, NzToolTipModule, NzBadgeModule, NzListModule, NzButtonModule],
  exports: [NotificationDropdownComponent],
})
export class NotificationDropdownModule {}
