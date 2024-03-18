import { TestBed } from '@angular/core/testing';
import { NotificationType, UINotification } from '@instigo-app/data-transfer-object';
import { TranslateService } from '@ngx-translate/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DisplayNotificationService } from './display-notification.service';

describe('DisplayNotificationService', () => {
  let service: DisplayNotificationService;
  let nzNotificationService: NzNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NzNotificationService, useValue: { create: () => 'test', remove: () => 'test' } },
        { provide: TranslateService, useValue: { instant: (s) => s } },
      ],
    });
    service = TestBed.inject(DisplayNotificationService);
    nzNotificationService = TestBed.inject(NzNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('displayNotification', () => {
    it('should call removePreviousNotificationIfSame with notification from argument', () => {
      const spy = jest.spyOn(service as any, 'removePreviousNotificationIfSame');
      const notification = new UINotification({ type: NotificationType.INFO });
      service.displayNotification(notification);
      expect(spy).toBeCalledWith(notification, 'test');
    });

    it('should update _previousNotification ', () => {
      const notification = new UINotification({ type: NotificationType.INFO });
      service.displayNotification(notification);
      expect((service as any)._previousNotification).toEqual('test');
    });
  });

  describe('removePreviousNotificationIfSame', () => {
    it('should call notificationService.remove with _previousNotification.messageId', () => {
      (service as any)._previousNotification = { messageId: 'test 1' };
      const spy = jest.spyOn(nzNotificationService, 'remove');
      const notification = new UINotification({ type: NotificationType.INFO });
      (service as any).removePreviousNotificationIfSame(notification, notification);
      expect(spy).toBeCalledWith('test 1');
    });

    it('should NOT call notificationService.remove', () => {
      const spy = jest.spyOn(nzNotificationService, 'remove');
      const currentNotification = new UINotification({ type: NotificationType.INFO });
      const prevNotification = new UINotification({ type: NotificationType.ERROR });
      (service as any).removePreviousNotificationIfSame(currentNotification, prevNotification);
      expect(spy).not.toBeCalled();
    });
  });
});
