import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FacebookConnectionsComponent } from './facebook-connections.component';
import { PromotePageDropdownModule } from './promote-page-dropdown/promote-page-dropdown.module';
import { UiFacebookModule } from '@instigo-app/ui/facebook';

@NgModule({
  declarations: [FacebookConnectionsComponent],
  exports: [FacebookConnectionsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PromotePageDropdownModule,
    UiSharedModule,
    UiFacebookModule,
    FormsModule,
    NzGridModule,
    NzSwitchModule,
    NzSelectModule,
    NzToolTipModule,
    NzFormModule,
    NzDividerModule,
    NzCardModule,
  ],
})
export class FacebookConnectionsModule {}
