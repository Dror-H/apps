import { NgModule } from '@angular/core';
import { DaypartingModule } from './dayparting/dayparting.module';
import { FacebookBudgetSettingsComponent } from './budget-settings.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NgxCurrencyModule } from 'ngx-currency';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { CampaignScheduleModule } from '@app/pages/new-campaign/facebook-new-campaign/components/budget-settings/campaign-schedule/campaign-schedule.module';

@NgModule({
  declarations: [FacebookBudgetSettingsComponent],
  imports: [
    DaypartingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    UiSharedModule,
    CampaignScheduleModule,
    NzGridModule,
    NzCardModule,
    NzFormModule,
    NzRadioModule,
    NzButtonModule,
    NzInputNumberModule,
    NzInputModule,
    NzToolTipModule,
    NzDividerModule,
    NzSwitchModule,
    NzAlertModule,
  ],
  exports: [FacebookBudgetSettingsComponent],
})
export class BudgetSettingsModule {}
