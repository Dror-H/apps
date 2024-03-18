import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzNotificationDataOptions, NzNotificationService } from 'ng-zorro-antd/notification';

export enum NotificationType {
  BLANK = 'blank',
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export class Notification {
  title?: string;
  content?: string;
  titleId?: string;
  contentId?: string;
  type: NotificationType;
  options?: NzNotificationDataOptions;

  constructor(obj: Notification) {
    Object.assign(this, obj);
  }
}

@Injectable()
export class DisplayNotification {
  constructor(private readonly notification: NzNotificationService, private readonly translate: TranslateService) {}

  public displayNotification(notification: Notification): void {
    notification.title = notification.titleId ? this.translate.instant(notification.titleId) : notification.title;
    notification.content = notification.contentId
      ? this.translate.instant(notification.contentId)
      : notification.content;
    this.notification.create(notification.type, notification.title, notification.content, {
      ...notification.options,
      nzClass: `ingo-notification-${notification.type}`,
    });
  }
}
