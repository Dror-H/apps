import { TestBed } from '@angular/core/testing';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const ENGLISH_LANGUAGE = 'en';
const ENGLISH_TRANSLATIONS = {
  test: {
    titleId: 'The form is invalid. Recheck the fields.',
    contentId: 'The form is invalid. Recheck the fields.',
  },
};

const TRANSLATIONS = {
  [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
};

describe('display notifications', () => {
  let displayNotificationService: DisplayNotification;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NzNotificationModule, TranslateTestingModule.withTranslations(TRANSLATIONS), NoopAnimationsModule],
      providers: [DisplayNotification],
    });
    displayNotificationService = TestBed.inject(DisplayNotification);
  });

  it('should initialize', () => {
    expect(displayNotificationService).toBeTruthy();
  });

  it('should display the notification', () => {
    const spy = jest.spyOn(displayNotificationService, 'displayNotification').mockImplementation();
    displayNotificationService.displayNotification(
      new Notification({
        title: 'The form is invalid. Recheck the fields.',
        type: NotificationType.ERROR,
      }),
    );
    expect(spy).toHaveBeenCalledWith(
      new Notification({
        title: 'The form is invalid. Recheck the fields.',
        type: NotificationType.ERROR,
      }),
    );
  });

  it('it should NOT translate', () => {
    const spy = jest.spyOn((displayNotificationService as any).notification, 'create').mockImplementation();
    displayNotificationService.displayNotification(
      new Notification({
        title: 'The form is invalid. Recheck the fields.',
        type: NotificationType.ERROR,
        content: 'some content here',
      }),
    );
    expect(spy).toHaveBeenCalledWith('error', 'The form is invalid. Recheck the fields.', 'some content here', {
      nzClass: 'ingo-notification-error',
    });
  });

  it('it should translate', () => {
    const spy = jest.spyOn((displayNotificationService as any).notification, 'create').mockImplementation();
    displayNotificationService.displayNotification(
      new Notification({
        titleId: 'test.titleId',
        type: NotificationType.ERROR,
        contentId: 'test.contentId',
      }),
    );
    expect(spy).toHaveBeenCalledWith(
      'error',
      'The form is invalid. Recheck the fields.',
      'The form is invalid. Recheck the fields.',
      {
        nzClass: 'ingo-notification-error',
      },
    );
  });

  it('it should test options translate', () => {
    const spy = jest.spyOn((displayNotificationService as any).notification, 'create').mockImplementation();
    displayNotificationService.displayNotification(
      new Notification({
        titleId: 'test.titleId',
        type: NotificationType.ERROR,
        options: { nzStyle: { color: 'red' } },
      }),
    );
    expect(spy).toHaveBeenCalledWith('error', 'The form is invalid. Recheck the fields.', undefined, {
      nzClass: 'ingo-notification-error',
      nzStyle: { color: 'red' },
    });
  });
});
