import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { CommonModule } from '@angular/common';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { TranslateModule } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NewCampaignLayoutComponent } from './new-campaign-layout.component';
import { NewCampaignRoutingModule } from './new-campaign-routing.module';
import { LinkedinNewCampaignModule } from './linkedin-new-campaign/linkedin-new-campaign.module';
import { CampaignResultModule } from './facebook-new-campaign/components/campaign-result/campaign-result.module';
import { NewCampaignLayoutService } from './new-campaign-layout.service';
import { FacebookNewCampaignModule } from './facebook-new-campaign/facebook-new-campaign.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@NgModule({
  declarations: [NewCampaignLayoutComponent],
  imports: [
    CommonModule,
    NewCampaignRoutingModule,
    FacebookNewCampaignModule,
    LinkedinNewCampaignModule,
    UiSharedModule,
    CampaignResultModule,
    TranslateModule,
    NzButtonModule,
    NzFormModule,
    NzPageHeaderModule,
    NzCardModule,
    NzToolTipModule,
    NzBadgeModule,
  ],
  exports: [NewCampaignLayoutComponent],
})
export class NewCampaignLayoutModule {}
