import { waitForAsync } from '@angular/core/testing';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import {
  ErrorType,
  notificationOnErrorOperator,
  notificationOnSuccessOperator,
  notificationOperator,
} from '@audience-app/global/utils/operators';
import {
  AudiOperatorsTestCase,
  errorTypesTests,
  notificationOptionsCases,
} from '@audience-app/global/utils/operators-test-data';
import { NotificationType, UINotification } from '@instigo-app/data-transfer-object';
import { of, throwError } from 'rxjs';

describe('notification operators', () => {
  let mockNotificationService: Partial<DisplayNotificationService>;

  beforeEach(() => {
    mockNotificationService = { displayNotification: jest.fn() };
  });

  describe('notificationOnErrorOperator', () => {
    it('should call displayNotificationService.displayNotification with correct notification', waitForAsync(() => {
      notificationOptionsCases.forEach((option) => {
        runTest(option);
      });
      errorTypesTests.forEach((error) => {
        runTest(null, error);
      });
      runTest(notificationOptionsCases[0], errorTypesTests[0]);

      function runTest(
        notificationOptions: AudiOperatorsTestCase<UINotification> | null = null,
        err: AudiOperatorsTestCase<ErrorType, UINotification> | null = null,
      ): void {
        throwError(err?.case)
          .pipe(
            notificationOnErrorOperator(
              mockNotificationService as DisplayNotificationService,
              notificationOptions?.case,
            ),
          )
          .subscribe({
            error: () => {
              expect(mockNotificationService.displayNotification).toBeCalledWith(
                notificationOptions?.expect || err?.expect,
              );
            },
          });
      }
    }));
  });

  describe('notificationOnSuccessOperator', () => {
    it('should call provided instance of notification service on success', (done): void => {
      const content = 'test content';
      const mockNotification = new UINotification({
        content,
        type: NotificationType.SUCCESS,
      });

      of(content)
        .pipe(notificationOnSuccessOperator(mockNotificationService as DisplayNotificationService, { content }))
        .subscribe(() => {
          expect(mockNotificationService.displayNotification).toBeCalledWith(mockNotification);
          done();
        });
    });
  });

  describe('notificationOperator', () => {
    it('should call service with notification', (done) => {
      const mockNotification = {
        type: NotificationType.BLANK,
        content: 'test',
      };

      of('test')
        .pipe(notificationOperator(mockNotificationService as DisplayNotificationService, mockNotification))
        .subscribe(() => {
          expect(mockNotificationService.displayNotification).toBeCalledWith(mockNotification);
          done();
        });
    });
  });
});
