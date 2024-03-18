import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationApiService } from '@app/api/services/notification-api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SubSink } from 'subsink';

@Component({
  selector: 'instigo-app-banner',
  template: ``,
})
export class BannerComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  constructor(
    private readonly notificationApiService: NotificationApiService,
    private notification: NzNotificationService,
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.notificationApiService.bannerNotifications().subscribe((messages) => {
      messages.forEach((message) => {
        const notification = this.notification.warning(message.title, message.description, {
          nzDuration: 0,
          nzClass: 'ingo-notification-banner',
        });
        this.subscriptions.sink = notification.onClose.subscribe(() => {
          this.closeNotification(message) as any;
        });
      });
    });
  }

  closeNotification(notification: any): void {
    this.notificationApiService.markAsRead({ notification: [notification] }).subscribe();
  }
}
