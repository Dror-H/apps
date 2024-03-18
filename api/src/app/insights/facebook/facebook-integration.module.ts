import { AdModule } from '@api/ad/ad.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdAccountModule } from '../../ad-account/ad-account.module';
import { FacebookInsightsEntity } from '../data/facebook-insights.entity';
import { InsightsAuditEntity } from '../data/insights-audit.entity';
import { FacebookApiService } from './facebook-api.service';
import { FacebookInsightsCrawlerService } from './facebook-insights-crawler.service';
import { FacebookJobsController } from './facebook.controller';
import { MockInsightsService } from './mock.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FacebookInsightsEntity, InsightsAuditEntity]),
    AdAccountModule,
    AdModule,
  ],
  controllers: [FacebookJobsController],
  providers: [FacebookApiService, MockInsightsService, FacebookInsightsCrawlerService],
  exports: [FacebookApiService, TypeOrmModule],
})
export class FacebookIntegrationModule {}
