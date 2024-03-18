import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Inject, Post } from '@nestjs/common';
import { ProviderNotificationScraperService } from '../services/provider-notification-scraper.service';

@CompositionDecorator({ resource: Resources.CRON_JOBS, useGuards: false })
export class NotificationCronJobController {
  @Inject(ProviderNotificationScraperService)
  private readonly notificationScraperService: ProviderNotificationScraperService;

  @Post('facebook_notifications')
  facebookNotifications(): any {
    void this.notificationScraperService.scrapeFacebookNotification().then();
    return new ResponseSuccess('JOB STARTED');
  }
}
