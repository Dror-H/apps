import { Injectable } from '@angular/core';
import { PaymentsApiService } from '@app/api/services/payments.api.service';
import { SubscriptionsApiService } from '@app/api/services/subscriptions.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { Loading, NotificationType, RxStore, SubscriptionStatusEnum } from '@instigo-app/data-transfer-object';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { StripeService } from 'ngx-stripe';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class SubscriptionService {
  currentSubscription$: RxStore<any> = new RxStore<any>(undefined);
  currentPaymentMethod$: RxStore<any> = new RxStore<any>(undefined);

  constructor(
    private subscriptionsApiService: SubscriptionsApiService,
    private paymentsApiService: PaymentsApiService,
    private stripeService: StripeService,
    private store: Store,
    private displayNotification: DisplayNotification,
  ) {}

  initialize() {
    this.currentSubscription().subscribe((result) => {
      this.currentSubscription$.patchState(result);
    });
    this.paymentMethod().subscribe((result) => {
      if (result) this.currentPaymentMethod$.patchState(result);
    });
  }

  public paymentMethod(): Observable<any> {
    return this.paymentsApiService.findAll().pipe(
      map((res) => {
        const data = res[0];
        if (data?.id) {
          return { brand: data?.card?.brand, last4: data?.card?.last4, id: data?.id };
        }
        return undefined;
      }),
      share(),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      }),
    );
  }

  public updatePaymentMethod({ user, card }) {
    this.store.dispatch(new Loading({ loading: true }));
    return this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: card?.element,
        billing_details: {
          name: user.username,
          email: user.email,
        },
      })
      .pipe(
        switchMap((paymentMethod) => {
          const payload = {
            payment: paymentMethod.paymentMethod?.id,
          };
          return this.paymentsApiService.create({
            payload,
          });
        }),
        tap(() => {
          this.displayNotification.displayNotification(
            new Notification({
              title: 'Payment Method Updated',
              type: NotificationType.SUCCESS,
            }),
          );
          this.store.dispatch(new Loading({ loading: false }));
        }),
        catchError((error) => {
          console.error(error);
          this.displayNotification.displayNotification(
            new Notification({
              title: 'Your card was declined.',
              type: NotificationType.ERROR,
            }),
          );
          this.store.dispatch(new Loading({ loading: false }));
          return EMPTY;
        }),
      );
  }

  public currentSubscription(): Observable<any> {
    return this.subscriptionsApiService.findAll().pipe(
      map((response) => response.data),
      share(),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      }),
    );
  }

  deleteSubscription() {
    return this.subscriptionsApiService.cancelSubscription().pipe(
      map(() => {
        this.displayNotification.displayNotification(
          new Notification({
            title: `Downgrade successful`,
            type: NotificationType.SUCCESS,
          }),
        );
        return this.store.dispatch([new Navigate(['dashboard/workspace'])]);
      }),
      catchError((error) => {
        console.error(error);
        this.displayNotification.displayNotification(
          new Notification({
            title: 'Ops something went wrong',
            type: NotificationType.ERROR,
          }),
        );
        return EMPTY;
      }),
    );
  }

  public checkPaymentMethod(): void {
    if (!this.currentPaymentMethod$.state?.id) {
      this.displayNotification.displayNotification(
        new Notification({
          title: 'Missing Payment Method',
          content: 'You must add a valid payment method before you can make any changes to your subscription',
          type: NotificationType.ERROR,
        }),
      );
      throw new Error('You must add a valid payment method before you can make any changes to your subscription');
    }
    return;
  }

  pay(options: { quantity?: number; billingCycle: string; coupon?: any }) {
    const { coupon, billingCycle, quantity } = options;
    this.checkPaymentMethod();
    const payload = {
      price: environment.prices[billingCycle] || environment.prices.month,
      coupon: coupon?.id,
      quantity: quantity || 1,
    };

    let subscription;

    subscription = this.subscriptionsApiService.create({
      payload,
    });

    if (
      this.currentSubscription$.state?.id &&
      (this.currentSubscription$.state?.status === SubscriptionStatusEnum.PAYMENT_FAILED ||
        this.currentSubscription$.state?.status === SubscriptionStatusEnum.ACTIVE)
    ) {
      subscription = this.subscriptionsApiService.updateSubscription({ payload });
    }

    this.store.dispatch(new Loading({ loading: true }));
    return subscription.pipe(
      map((response: any) => response.data),
      switchMap((response: any) => {
        const { client_secret, status } = response;
        this.store.dispatch(new Loading({ loading: false }));
        if (status === 'requires_action') {
          return this.stripeService.confirmCardPayment(client_secret);
        }
        return of(status);
      }),
      switchMap((response: any) => {
        this.store.dispatch(new Loading({ loading: false }));
        if (response?.error) {
          this.initialize();
          this.displayNotification.displayNotification(
            new Notification({
              content: response?.error?.message,
              type: NotificationType.ERROR,
            }),
          );
          return EMPTY;
        } else {
          this.initialize();
          this.displayNotification.displayNotification(
            new Notification({
              title: `Payment successful`,
              type: NotificationType.SUCCESS,
            }),
          );
          return of({});
        }
      }),
      catchError((error) => {
        this.store.dispatch(new Loading({ loading: false }));
        this.displayNotification.displayNotification(
          new Notification({
            content: error?.error?.message,
            type: NotificationType.ERROR,
          }),
        );
        return EMPTY;
      }),
    );
  }

  checkPromoCode({ code }): Observable<any> {
    return this.subscriptionsApiService.getCoupon({ id: code }).pipe(
      map((response: any) => response?.data),
      map((value: any) => {
        if (!value['amount_off'] && !value['percent_off']) {
          throwError('No amount , no percent ');
        }
        if (!value.valid) {
          throwError('Invalid coupon');
        }
        this.displayNotification.displayNotification(
          new Notification({
            title: 'Coupon Applied',
            content: 'A discount has been applied to your total',
            type: NotificationType.SUCCESS,
          }),
        );
        return value;
      }),
      catchError((error) => {
        console.error(error);
        this.displayNotification.displayNotification(
          new Notification({
            title: 'Invalid coupon',
            content: 'The code you have entered is incorrect',
            type: NotificationType.ERROR,
          }),
        );
        return EMPTY;
      }),
    );
  }
}
