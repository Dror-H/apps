import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationApiService } from '@app/api/services/notification-api.service';
import { catchError, delay, mergeMap, repeat, take, tap } from 'rxjs/operators';
import { NotificationType } from '@instigo-app/data-transfer-object';
import { SubSink } from 'subsink';
import { of } from 'rxjs';

@Component({
  selector: 'instigo-app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  public notifications: any[] = [];
  public isNotificationsVisible = false;
  public isNewNotification = false;
  public iconsTypes = {
    [NotificationType.INFO]: 'fa-info',
    [NotificationType.SUCCESS]: 'fa-check',
    [NotificationType.WARNING]: 'fa-exclamation-triangle',
    [NotificationType.ERROR]: 'fa-exclamation-circle',
  };

  private subSink = new SubSink();

  constructor(private notificationApiService: NotificationApiService) {}

  ngOnInit(): void {
    const poll = of({}).pipe(
      mergeMap((_) =>
        this.notificationApiService.notifications().pipe(
          catchError((e) => {
            console.error(e);
            return of([]);
          }),
        ),
      ),
      tap((notifications: any[]) => {
        this.isNewNotification = notifications.some((n) => n.read === false);
        this.isNotificationsVisible = false;
        this.notifications = notifications;
      }),
      delay(15000),
      repeat(),
    );

    this.subSink.sink = poll.subscribe();
  }

  public markNotificationsRead(): void {
    this.notificationApiService
      .markAsRead({ notification: this.notifications })
      .pipe(take(1))
      .subscribe(() => {
        this.isNewNotification = false;
        this.isNotificationsVisible = false;
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
