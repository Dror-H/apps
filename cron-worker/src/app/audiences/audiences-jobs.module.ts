import { StripeModule } from '@golevelup/nestjs-stripe';
import { AudiencesSharedModule } from '@instigo-app/api-shared';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AddToTargetingsSegmentsRelatedWordsService } from './jobs/add_to_targetings_segements_related_words.service';
import { CrawlAdAccountService } from './jobs/crawl-ad-account.service';
import { ImportInstigoAdAccountsService } from './jobs/import-instigo-ad-accounts.service';
import { RebuildIndexService } from './jobs/rebuild-index.service';
import { SeedSegmentsService } from './jobs/seed-segments.service';
import { SyncAdAccountService } from './jobs/sync-ad-account.service';
import { SyncUserSubscriptionService } from './jobs/sync-user-subscription.service';
import { AdAccountRepository } from './services/ad-account.repository';
import { SegmentsService } from './services/segments.service';

const providers = [
  SegmentsService,
  SyncAdAccountService,
  RebuildIndexService,
  AddToTargetingsSegmentsRelatedWordsService,
  AdAccountRepository,
  CrawlAdAccountService,
  SyncUserSubscriptionService,
  SeedSegmentsService,
  ImportInstigoAdAccountsService,
];

@Module({
  imports: [
    ThirdPartyApiIntegrationModule,
    DatabaseModule,
    AudiencesSharedModule,
    HttpModule,
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_SECRET_KEY'),
        apiVersion: '2020-08-27',
        typescript: true,
        webhookConfig: {
          stripeWebhookSecret: configService.get<string>('STRIPE_WEBHOOK_SECRET'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [...providers],
  exports: [...providers],
})
export class AudiencesJobsModule {}
