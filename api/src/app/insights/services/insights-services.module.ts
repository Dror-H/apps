import { CachingModule } from '@api/database';
import { ExchangeRateModule } from '@api/exchange-rate/exchange-rate.module';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { AdSpendService } from './ad-spend.service';
import { InsightsTableService } from './insights-table.service';
import { InsightsUtilService } from './insights-util.service';
import { ResourceInsightsService } from './resource-insights.service';

@Module({
  imports: [ExchangeRateModule, ThirdPartyApiIntegrationModule, CachingModule],
  providers: [ResourceInsightsService, InsightsTableService, AdSpendService, InsightsUtilService],
  exports: [ResourceInsightsService, AdSpendService, InsightsTableService, InsightsUtilService],
})
export class InsightsServicesModule {}
