import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ChartsModule } from 'ng2-charts';
import { DeviceBreakdownComponent } from './device-breakdown.component';
import { SharedModule } from '@app/shared/shared/shared.module';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [DeviceBreakdownComponent],
  imports: [
    SharedModule,
    CommonModule,
    ChartsModule,
    UiSharedModule,
    NzGridModule,
    NzCardModule,
    NzDividerModule,
    NzMenuModule,
    NzDropDownModule,
    NzSpinModule,
  ],
  exports: [DeviceBreakdownComponent],
  providers: [],
})
export class DeviceBreakdownModule {}
