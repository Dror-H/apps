import { AdAccountModule } from '@api/ad-account/ad-account.module';
import { AdModule } from '@api/ad/ad.module';
import { CampaignModule } from '@api/campaign/campaign.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsAuditEntity } from '../data/insights-audit.entity';
import { LinkedinInsightsEntity } from '../data/linkedin-insights.entity';
import { LinkedinApiService } from './linkedin-api.service';
import { LinkedinInsightsCrawlerService } from './linkedin-insights-crawler.service';
import { LinkedinJobsController } from './linkedin.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([LinkedinInsightsEntity, InsightsAuditEntity]),
    AdAccountModule,
    CampaignModule,
    AdModule,
  ],
  controllers: [LinkedinJobsController],
  providers: [LinkedinApiService, LinkedinInsightsCrawlerService],
})
export class LinkedinIntegrationModule {}
