import { NgModule } from '@angular/core';
import { CampaignAdSetsComparisonComponent } from './campaign-adsets-comparison.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UiSharedModule } from '@instigo-app/ui/shared';
@NgModule({
  declarations: [CampaignAdSetsComparisonComponent],
  imports: [CommonModule, NzCardModule, NzListModule, NzTypographyModule, NzSpinModule, UiSharedModule],
  exports: [CampaignAdSetsComparisonComponent],
})
export class CampaignAdsetsComparisonModule {}
