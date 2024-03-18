import { getTestBed, TestBed } from '@angular/core/testing';
import { PaymentsApiService } from '@app/api/services/payments.api.service';
import { SubscriptionsApiService } from '@app/api/services/subscriptions.api.service';
import { DisplayNotification } from '@app/global/display-notification.service';
import { Store } from '@ngxs/store';
import { StripeService } from 'ngx-stripe';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let injector: TestBed;
  let subscriptionService: SubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SubscriptionService,
        { provide: SubscriptionsApiService, useValue: {} },
        { provide: PaymentsApiService, useValue: {} },
        { provide: StripeService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: DisplayNotification, useValue: {} },
      ],
    });

    injector = getTestBed();
    subscriptionService = injector.inject(SubscriptionService);
  });

  it('should be defined', () => {
    expect(subscriptionService).toBeDefined();
  });
});
