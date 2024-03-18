import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { NotificationsActivityController } from './controllers/activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { ProviderNotificationScraperService } from './services/provider-notification-scraper.service';
import { NotificationRepository } from './services/notification.repository';
import { HandleNotificationService } from './services/handle-notification.service';
import { AdAccountModule } from '@api/ad-account/ad-account.module';
import { WorkspaceModule } from '@api/workspace/workspace.module';
import { NotificationCronJobController } from './controllers/notification-cron.controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationRepository]),
    ThirdPartyApiIntegrationModule,
    AdAccountModule,
    WorkspaceModule,
  ],
  controllers: [NotificationController, NotificationsActivityController, NotificationCronJobController],
  providers: [HandleNotificationService, ProviderNotificationScraperService],
  exports: [],
})
export class NotificationModule {}
