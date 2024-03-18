import { NgModule } from '@angular/core';
import { LinkedinNewCampaignComponent } from './linkedin-new-campaign.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { LinkedinCampaignSettingsModule } from './components/campaign-setttings/linkedin-campaign-settings.module';
import { LinkedinCreativeSettingsModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/creative-settings/linkedin-creative-settings.module';
import { LinkedinTargetingSettingsModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/targeting-settings/linkedin-targeting-settings.module';
import { LinkedinBudgetSettingsModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/budget-settings/linkedin-budget-settings.module';
import { MultiVariateCreativesService } from '@app/pages/new-campaign/services/multi-variate-creatives.service';
import { LinkedinCampaignOverviewModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/campaign-overview/linkedin-campaign-overview.module';

@NgModule({
  declarations: [LinkedinNewCampaignComponent],
  imports: [
    NzFormModule,
    NzCollapseModule,
    CommonModule,
    LinkedinCampaignSettingsModule,
    LinkedinCreativeSettingsModule,
    LinkedinTargetingSettingsModule,
    LinkedinBudgetSettingsModule,
    LinkedinCampaignOverviewModule,
  ],
  exports: [LinkedinNewCampaignComponent],
  providers: [MultiVariateCreativesService],
})
export class LinkedinNewCampaignModule {}
