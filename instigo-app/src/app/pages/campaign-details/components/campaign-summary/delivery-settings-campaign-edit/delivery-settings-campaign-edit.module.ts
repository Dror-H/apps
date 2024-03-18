import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgxCurrencyModule } from 'ngx-currency';
import { DeliverySettingsCampaignEditComponent } from './delivery-settings-campaign-edit.component';

@NgModule({
  declarations: [DeliverySettingsCampaignEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzInputNumberModule,
    NzToolTipModule,
    NzSwitchModule,
    NzDividerModule,
    NzButtonModule,
    NgxCurrencyModule,
    NzAlertModule,
    UiSharedModule,
  ],
  exports: [DeliverySettingsCampaignEditComponent],
})
export class DeliverySettingsCampaignEditModule {}
