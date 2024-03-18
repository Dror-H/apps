import { NgModule } from '@angular/core';
import { LinkedinBudgetSettingsComponent } from './linkedin-budget-settings.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxCurrencyModule } from 'ngx-currency';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CampaignScheduleModule } from '@app/pages/new-campaign/facebook-new-campaign/components/budget-settings/campaign-schedule/campaign-schedule.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LinkedinBudgetSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiSharedModule,
    NzButtonModule,
    TranslateModule,
    CampaignScheduleModule,
    NzCardModule,
    NzFormModule,
    NzRadioModule,
    NzToolTipModule,
    NzInputModule,
    NgxCurrencyModule,
    NzAlertModule,
    NzSelectModule,
    NzDividerModule,
  ],
  exports: [LinkedinBudgetSettingsComponent],
})
export class LinkedinBudgetSettingsModule {}
