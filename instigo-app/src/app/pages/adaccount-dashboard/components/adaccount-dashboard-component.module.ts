import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardAdAccountDropdownSelectorModule } from '@app/features/dashboard-ad-account-dropdown-selector/dashboard-ad-account-dropdown-selector.module';
import { DateRangePickerModule } from '@app/features/date-range-picker/date-range-picker.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AdAccountOverviewModule } from './ad-account-overview/ad-account-overview.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AdAccountDashboardComponent } from './adaccount-dashboard-component';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AdAccountDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateRangePickerModule,
    AdAccountOverviewModule,
    DashboardAdAccountDropdownSelectorModule,
    CampaignsModule,
    UiSharedModule,
    NzGridModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzEmptyModule,
    NzToolTipModule,
  ],
  exports: [AdAccountDashboardComponent],
})
export class AdAccountDashboardComponentModule {}
