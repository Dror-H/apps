import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { AdAccountModule } from '../ad-account/ad-account.module';
import { AdSetModule } from '../ad-set/ad-set.module';
import { AdModule } from '../ad/ad.module';
import { CampaignModule } from '../campaign/campaign.module';
import { CachingModule } from '../database';
import { InsightsController } from './controllers/insights.controller';
import { FacebookIntegrationModule } from './facebook/facebook-integration.module';
import { LinkedinIntegrationModule } from './linkedin/linkedin.integration.module';
import { InsightsServicesModule } from './services/insights-services.module';
@Module({
  controllers: [InsightsController],
  imports: [
    FacebookIntegrationModule,
    LinkedinIntegrationModule,
    AdAccountModule,
    AdModule,
    AdSetModule,
    CachingModule,
    CampaignModule,
    InsightsServicesModule,
    ThirdPartyApiIntegrationModule,
  ],
  providers: [],
  exports: [],
})
export class InsightsModule {}
