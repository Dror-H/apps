import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { PageRepository } from '@api/ad-account/data/page.repository';
import { AdSetRepository } from '@api/ad-set/data/ad-set.repository';
import { AdRepository } from '@api/ad/data/ad.repository';
import { AudienceRepository } from '@api/audience/data/audience.repository';
import { OauthTokenRepository } from '@api/auth/data/oauthToken.repository';
import { CampaignGroupRepository } from '@api/campaign-group/data/campaign-group.repository';
import { CampaignRepository } from '@api/campaign/data/campaign.repository';
import { QueueModule } from '@api/database';
import { EventsRepository } from '@api/events/data/events.repository';
import { FileRepository } from '@api/file-manager/data/file.repository';
import { FileManagerModule } from '@api/file-manager/file-manager.module';
import { LeadgenFormRepository } from '@api/leadgen-form/data/leadgen_form.repository';
import { NotificationRepository } from '@api/notification/services/notification.repository';
import { EventsScrapperService } from '@api/platform-scraper/services/events.scrapper.service';
import { PostRepository } from '@api/post/data/post.repository';
import { PrettyLinkService } from '@instigo-app/api-shared';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronScrapperController } from './controllers/cron-scrapper.controller';
import { ScrapperController } from './controllers/scrapper.controller';
import { AdAccountScrapperService } from './services/ad-account.scrapper.service';
import { AdSetScrapperService } from './services/ad-set.scrapper.service';
import { AdScrapperService } from './services/ad.scrapper.service';
import { AudienceScrapperService } from './services/audience.scrapper.service';
import { CampaignMostPopularActionScrapperService } from './services/campaign-most-popular-action.service';
import { CampaignScrapperService } from './services/campaign.scrapper.service';
import { DataSynchronizationService } from './services/datasync.service';
import { FilesScrapperService } from './services/file.scapper.service';
import { LeadgenFormScrapperService } from './services/leadgen-form.scrapper.service';
import { PostScrapperService } from './services/post.scrapper.service';
import { SyncAdAccountByNotificationService } from './services/sync-ad-account-by-notification.service';

@Module({
  imports: [
    QueueModule,
    TypeOrmModule.forFeature([
      CampaignRepository,
      AdAccountRepository,
      AudienceRepository,
      AdRepository,
      AdSetRepository,
      OauthTokenRepository,
      PostRepository,
      NotificationRepository,
      LeadgenFormRepository,
      EventsRepository,
      PageRepository,
      CampaignGroupRepository,
      FileRepository,
    ]),
    ThirdPartyApiIntegrationModule,
    FileManagerModule,
  ],
  controllers: [CronScrapperController, ScrapperController],
  providers: [
    CampaignScrapperService,
    AudienceScrapperService,
    AdSetScrapperService,
    AdScrapperService,
    DataSynchronizationService,
    AdAccountScrapperService,
    PostScrapperService,
    LeadgenFormScrapperService,
    EventsScrapperService,
    SyncAdAccountByNotificationService,
    CampaignMostPopularActionScrapperService,
    FilesScrapperService,
    PrettyLinkService,
  ],
  exports: [],
})
export class PlatformScraperModule {}
