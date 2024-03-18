import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { CampaignSettingsModule } from './components/campaign-settings/campaign-settings.module';
import { FacebookNewCampaignComponent } from './facebook-new-campaign.component';
import { NewCampaignServiceModule } from '@app/pages/new-campaign/services/new-campaign-service.module';
import { BudgetSettingsModule } from '@app/pages/new-campaign/facebook-new-campaign/components/budget-settings/budget-settings.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CampaignResultModule } from './components/campaign-result/campaign-result.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { CreativesSettingsModule } from './components/creatives-settings/creatives-settings.module';
import { DeliverySettingsModule } from './components/delivery-settings/delivery-settings.module';
import { CampaignOverviewModule } from './components/campaign-overview/campaign-overview.module';
import { TargetingSettingsModule } from './components/targeting-settings/targeting-settings.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [FacebookNewCampaignComponent],
  imports: [
    CommonModule,
    RouterModule,
    NewCampaignServiceModule,
    ReactiveFormsModule,
    CampaignSettingsModule,
    CreativesSettingsModule,
    TargetingSettingsModule,
    BudgetSettingsModule,
    DeliverySettingsModule,
    CampaignOverviewModule,
    CampaignResultModule,
    TranslateModule,
    UiSharedModule,
    NzGridModule,
    NzCollapseModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzAlertModule,
  ],
})
export class FacebookNewCampaignModule {}
