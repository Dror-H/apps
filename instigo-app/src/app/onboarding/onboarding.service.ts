import { Injectable } from '@angular/core';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { PaymentsApiService } from '@app/api/services/payments.api.service';
import { SubscriptionsApiService } from '@app/api/services/subscriptions.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { AdAccountDTO, BusinessDTO, Loading, User } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { groupBy } from 'lodash-es';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, share, switchMap, take, tap } from 'rxjs/operators';
import { UserApiService } from '../api/services/user.api.service';
import { WorkspaceApiService } from '../api/services/workspace.api.service';
import { UserState } from '../global/user.state';
import { OnboardingState, OnboardingStateModel } from './onboarding.state';

@Injectable()
export class OnboardingService {
  @Select(UserState.get) getUser$: Observable<User>;
  @Select(OnboardingState.get) getOnboarding$: Observable<OnboardingStateModel>;

  @Emitter(UserState.update) updateUser: Emittable<Partial<User>>;
  @Emitter(OnboardingState.update) updateOnboarding: Emittable<Partial<OnboardingStateModel>>;

  private successNotificationDuration = 6000;

  constructor(
    private store: Store,
    private displayNotification: DisplayNotification,
    private userApiService: UserApiService,
    private adAccountApiService: AdAccountApiService,
    private workspaceApiService: WorkspaceApiService,
    private paymentsApiService: PaymentsApiService,
    private stripeService: StripeService,
    private subscriptionsApiService: SubscriptionsApiService,
  ) {}

  getUserData() {
    return this.userApiService.me();
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

  assignCardToUser(options: { user: User; card: StripeCardComponent }): Observable<any> {
    return this.currentSubscription().pipe(
      switchMap(() =>
        this.updatePaymentMethod({
          user: options.user,
          card: options.card,
        }),
      ),
    );
  }

  validateData(options: { user: any }): Observable<any> {
    const { firstName, lastName, email } = options.user;
    return this.userApiService.updateMe({ payload: { firstName, lastName, email } }).pipe(
      tap((updatedUser) => {
        this.updateUser.emit(updatedUser);
        this.updateOnboarding.emit({ step: 2 });
      }),
      catchError((err) => {
        this.displayNotification.displayNotification(
          new Notification({ titleId: `app.register.${err.status}`, type: NotificationType.ERROR }),
        );
        return of(err);
      }),
    );
  }

  async validateDataForInvitedMember(options: { user: any }) {
    try {
      const { firstName, lastName, email, password } = options.user;
      const updatedUser = await this.userApiService
        .updateMe({ payload: { firstName, lastName, email, password, onboarding: { completed: true } } })
        .toPromise();
      this.updateUser.emit(updatedUser);
      this.store.dispatch(new Navigate(['/']));
    } catch (err) {
      this.displayNotification.displayNotification(
        new Notification({ titleId: `app.register.${err.status}`, type: NotificationType.ERROR }),
      );
    }
  }

  getAvailableAdAccounts(provider) {
    return this.adAccountApiService.getAvailableAdAccounts({ provider });
  }

  groupAdAccountsByBusiness({ adAccountsList }): BusinessDTO[] {
    return Object.entries(groupBy(adAccountsList, (adAccount) => adAccount.businessId)).map((element) => ({
      id: element[0],
      businessName: element[1][0].businessName,
      businessProfilePicture: element[1][0].businessProfilePicture,
      adAccounts: element[1],
    }));
  }

  getSelectedAdAccounts({ selectedAccountsIds, adAccountsList, provider }): AdAccountDTO[] {
    return selectedAccountsIds
      .map((providerId) => {
        const adAccount = adAccountsList.find((el) => el.providerId === providerId);
        return {
          provider,
          providerId: adAccount.providerId,
          name: adAccount.name,
          currency: adAccount.currency,
          status: adAccount.status,
          businessProfilePicture: adAccount.businessProfilePicture,
          businessName: adAccount.businessName,
          businessId: adAccount.businessId,
        };
      })
      .filter((el) => el !== undefined);
  }

  completeOnboarding() {
    return this.getOnboarding$
      .pipe(
        take(1),
        switchMap((onboarding) => this.workspaceApiService.onboard({ payload: onboarding })),
        switchMap((response: any) => {
          const { data } = response;
          this.updateUser.emit(data);
          return this.store.dispatch([new Navigate(['/'])]);
        }),

        switchMap(() =>
          this.store.dispatch([
            new StateOverwrite([
              OnboardingState,
              { step: 1, workspace: null, invitedMembers: [], selectedAdAccounts: [] },
            ]),
          ]),
        ),
        tap(() => {
          this.displayNotification.displayNotification(
            new Notification({
              titleId: `app.onboarding.completeOnboardingMessage`,
              type: NotificationType.INFO,
              options: { nzDuration: this.successNotificationDuration },
            }),
          );
        }),
        catchError((_) => {
          this.displayNotification.displayNotification(
            new Notification({ titleId: `app.onboarding.completeOnboardingError`, type: NotificationType.ERROR }),
          );
          return EMPTY;
        }),
      )
      .toPromise();
  }
}
