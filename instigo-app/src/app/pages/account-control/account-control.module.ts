import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
// NgZorro
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AccountControlRoutingModule } from './account-control-routing.module';
import { AccountControlComponent } from './components/account-control.component';
import { CardControlComponent } from './components/card-control/card-control.component';

@NgModule({
  declarations: [AccountControlComponent, CardControlComponent],
  imports: [
    CommonModule,
    AccountControlRoutingModule,
    NzPageHeaderModule,
    NzTagModule,
    NzGridModule,
    NzCardModule,
    NzBreadCrumbModule,
    NzAvatarModule,
    NzDividerModule,
    NzDropDownModule,
    UiSharedModule,
  ],
  providers: [],
})
export class AccountControlModule {}
