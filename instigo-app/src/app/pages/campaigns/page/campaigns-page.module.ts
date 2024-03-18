import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DateRangePickerModule } from '@app/features/date-range-picker/date-range-picker.module';
import { CampaignsPageRoutingModule } from '@app/pages/campaigns/page/campaigns-page-routing.module';
import { AdsViewModule } from '@app/pages/campaigns/view/ads-view/ads-view.module';
import { AdsetsViewModule } from '@app/pages/campaigns/view/adsets-view/adsets-view.module';
import { CampaignsViewModule } from '@app/pages/campaigns/view/campaigns-view/campaigns-view.module';
import { FilterModule } from '@app/shared/filters/filter.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CampaignsPageComponent } from './campaigns-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FilterModule,
    DateRangePickerModule,
    AdsViewModule,
    AdsetsViewModule,
    CampaignsViewModule,
    NzPageHeaderModule,
    NzGridModule,
    NzTabsModule,
    NzButtonModule,
    CampaignsPageRoutingModule,
    NzModalModule,
  ],
  declarations: [CampaignsPageComponent],
})
export class CampaignsPageModule {}
