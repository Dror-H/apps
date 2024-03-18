import { NgModule } from '@angular/core';
import { NewCampaignService } from '@app/pages/new-campaign/services/new-campaign.service';
import { MultiVariateCreativesService } from '@app/pages/new-campaign/services/multi-variate-creatives.service';

@NgModule({
  providers: [NewCampaignService, MultiVariateCreativesService],
})
export class NewCampaignServiceModule {}
