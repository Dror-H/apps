import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';

import SubscriptionsApiService from './subscriptions-api.service';

describe('SubscriptionsApiService', () => {
  let service: SubscriptionsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: DisplayNotificationService,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(SubscriptionsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
