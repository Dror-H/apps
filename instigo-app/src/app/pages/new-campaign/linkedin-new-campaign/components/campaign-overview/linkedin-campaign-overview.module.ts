import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinkedinCreativeVariationsOverviewModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/campaign-overview/creative-variations-overview/linkedin-creative-variations-overview.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { LinkedinCampaignOverviewComponent } from './linkedin-campaign-overview.component';

@NgModule({
  declarations: [LinkedinCampaignOverviewComponent],
  imports: [
    CommonModule,
    LinkedinCreativeVariationsOverviewModule,
    UiSharedModule,
    NzCardModule,
    NzCollapseModule,
    NzDividerModule,
  ],
  exports: [LinkedinCampaignOverviewComponent],
})
export class LinkedinCampaignOverviewModule {}
