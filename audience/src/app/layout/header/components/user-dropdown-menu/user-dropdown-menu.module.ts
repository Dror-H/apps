import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '@audience-app/shared/pipes/shared-pipes.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UserDropdownMenuComponent } from './user-dropdown-menu.component';

@NgModule({
  declarations: [UserDropdownMenuComponent],
  imports: [CommonModule, RouterModule, NzDropDownModule, NzAvatarModule, SharedPipesModule],
  exports: [UserDropdownMenuComponent],
})
export class UserDropdownMenuModule {}
