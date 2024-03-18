import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { NotificationType, UINotification } from '@instigo-app/data-transfer-object';
import { MonoTypeOperatorFunction, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ErrorType {
  error?: { message?: string; title?: string; description?: string };
  message?: string;
}

export function notificationOnErrorOperator<T>(
  displayNotificationService: DisplayNotificationService,
  notificationOptions?: Partial<UINotification>,
): MonoTypeOperatorFunction<T> {
  return catchError((err: ErrorType) => {
    const notification = new UINotification({
      type: NotificationType.ERROR,
      content: notificationOptions?.content || err.error?.message || err.error?.description || err.message,
      title: notificationOptions?.title || err?.error?.title,
      options: notificationOptions?.options,
    });
    displayNotificationService.displayNotification(notification);
    return throwError(err);
  });
}
export function notificationOnSuccessOperator<T>(
  displayNotificationService: DisplayNotificationService,
  notificationOptions: Omit<UINotification, 'type'>,
): MonoTypeOperatorFunction<T> {
  return tap(() => {
    const notification = new UINotification({
      ...notificationOptions,
      type: NotificationType.SUCCESS,
    });
    displayNotificationService.displayNotification(notification);
  });
}

export function notificationOperator<T>(
  displayNotificationService: DisplayNotificationService,
  notificationOptions: UINotification,
): MonoTypeOperatorFunction<T> {
  return tap(() => {
    const notification = new UINotification({ ...notificationOptions });
    displayNotificationService.displayNotification(notification);
  });
}
