import { ProviderNotificationScraperService } from '@api/notification/services/provider-notification-scraper.service';
import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import {
  Actions,
  Resources,
  ResponseSuccess,
  WorkspaceDTO,
  WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL,
} from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Body, Get, Inject, Post, Put } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationRepository } from '../services/notification.repository';

@CompositionDecorator({ resource: Resources.NOTIFICATIONS })
export class NotificationController {
  @Inject(NotificationRepository)
  private readonly notificationService: NotificationRepository;

  @Inject(ProviderNotificationScraperService)
  private readonly providerNotificationScraperService: ProviderNotificationScraperService;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Action(Actions.ReadAll)
  @Get()
  notification(@CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO, @CurrentUser() user: any) {
    return this.notificationService.notifications({ workspace, user });
  }

  @Action(Actions.ReadAll)
  @Get('banner')
  bannerNotification(@CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO, @CurrentUser() user: any) {
    return this.notificationService.bannerNotifications({ workspace, user });
  }

  @Action(Actions.MARK_AS_READ_NOTIFICATION)
  @Post('markasread')
  markAsReadNotification(@Body() body) {
    const { notification } = body;
    return this.notificationService.markAsReadNotification({ notification });
  }

  @Put()
  async scrapeNotification() {
    return this.providerNotificationScraperService.scrapeFacebookNotification();
  }

  @Post()
  createNotification(@Body() body) {
    const { notification } = body;
    this.eventEmitter.emit(WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL, notification);
    return new ResponseSuccess('Notification successfully created');
  }
}
