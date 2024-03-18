import { Injectable, TemplateRef } from '@angular/core';
import { UINotification } from '@instigo-app/data-transfer-object';
import { TranslateService } from '@ngx-translate/core';
import {
  NzNotificationData,
  NzNotificationDataOptions,
  NzNotificationRef,
  NzNotificationService,
} from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class DisplayNotificationService {
  private _previousNotification: NzNotificationRef;

  constructor(private readonly notificationService: NzNotificationService, private translate: TranslateService) {}

  public displayNotification(notification: UINotification): void {
    const notificationRef: NzNotificationRef = this.notificationService.create(
      notification.type,
      (notification.titleId && this.translate.instant(notification.titleId)) || notification.title,
      notification.content,
      {
        ...notification.options,
        nzClass: `audi-notification-${notification.type}`,
      },
    );
    this.removePreviousNotificationIfSame(notification, notificationRef);
    this._previousNotification = notificationRef;
  }

  public displayTemplateNotification(
    template: TemplateRef<unknown>,
    options: NzNotificationDataOptions,
  ): NzNotificationRef {
    return this.notificationService.template(template, options);
  }

  public removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  private removePreviousNotificationIfSame(notification: UINotification, notificationRef: NzNotificationData): void {
    if (
      this._previousNotification &&
      notification.type === notificationRef.type &&
      notification.content === notificationRef.content
    ) {
      this.notificationService.remove(this._previousNotification.messageId);
    }
  }
}
