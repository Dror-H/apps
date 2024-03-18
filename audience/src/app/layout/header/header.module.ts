import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserDropdownMenuModule } from '@audience-app/layout/header/components/user-dropdown-menu/user-dropdown-menu.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzAvatarModule,
    NzSpaceModule,
    NzLayoutModule,
    NzDropDownModule,
    NzGridModule,
    NzMenuModule,
    UserDropdownMenuModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
