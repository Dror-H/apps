import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CampaignOverviewComponent } from './campaign-overview.component';
import { CreativeVariationsOverviewModule } from './creative-variations-overview/creative-variations-overview.module';
import { DeliveryOverviewModule } from './delivery-overview/delivery-overview.module';

@NgModule({
  declarations: [CampaignOverviewComponent],
  imports: [
    CommonModule,
    CreativeVariationsOverviewModule,
    DeliveryOverviewModule,
    UiSharedModule,
    NzCardModule,
    NzCollapseModule,
    NzDividerModule,
  ],
  exports: [CampaignOverviewComponent],
})
export class CampaignOverviewModule {}
