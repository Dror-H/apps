import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DaypartingModule } from '@app/pages/new-campaign/facebook-new-campaign/components/budget-settings/dayparting/dayparting.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgBooleanPipesModule } from 'ngx-pipes';
import { CampaignSummaryComponent } from './campaign-summary.component';
import { DatePickerModule } from './date-picker/data-picker.module';
import { DeliverySettingsCampaignEditModule } from './delivery-settings-campaign-edit/delivery-settings-campaign-edit.module';

@NgModule({
  declarations: [CampaignSummaryComponent],
  exports: [CampaignSummaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DatePickerModule,
    DaypartingModule,
    DeliverySettingsCampaignEditModule,
    NzGridModule,
    NzCardModule,
    NzDescriptionsModule,
    NgBooleanPipesModule,
    NzPopoverModule,
    NzListModule,
    NzTypographyModule,
    NzSkeletonModule,
    NzToolTipModule,
    NgxCurrencyModule,
    NzInputModule,
    NzFormModule,
    NzSwitchModule,
  ],
})
export class CampaignSummaryModule {}
