import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationDropdownModule } from '@app/layout/notification-dropdown/notification-dropdown.module';
import { QuickNavModule } from '@app/layout/quick-nav/quick-nav.module';
import { ENVIRONMENT, UiSharedModule } from '@instigo-app/ui/shared';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzElementPatchModule } from 'ng-zorro-antd/core/element-patch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    QuickNavModule,
    CommonModule,
    NotificationDropdownModule,
    RouterModule,
    NzLayoutModule,
    NzPopoverModule,
    NzElementPatchModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzToolTipModule,
    NzTagModule,
    UiSharedModule,
  ],
  providers: [{ provide: ENVIRONMENT, useValue: environment }],
  exports: [HeaderComponent],
})
export class HeaderModule {}
