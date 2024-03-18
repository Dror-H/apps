import { InsightsServicesModule } from '@api/insights/services/insights-services.module';
import { Module } from '@nestjs/common';
import { CampaignDetailsController } from './campaign-details.controller';
import { CampaignDetailsService } from './campaign-details.service';
import { CampaignInsightsBreakdownService } from './campaign-insights-breakdown.service';

@Module({
  imports: [InsightsServicesModule],
  controllers: [CampaignDetailsController],
  providers: [CampaignDetailsService, CampaignInsightsBreakdownService],
})
export class CampaignDetailsModule {}
