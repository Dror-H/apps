import { NgModule } from '@angular/core';
import { UserSubscriptionContainerComponent } from './user-subscription-container.component';
import {
  DISPLAY_NOTIFICATION_SERVICE,
  ENVIRONMENT,
  PAYMENTS_API_SERVICE,
  SUBSCRIPTIONS_API_SERVICE,
  UiSharedModule,
} from '@instigo-app/ui/shared';
import SubscriptionsApiService from '@audience-app/api/subscriptions-api/subscriptions-api.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { PaymentsApiService } from '@audience-app/api/subscriptions-api/payments.api.service';
import { environment } from 'src/environments/environment';
import { NgxStripeModule } from 'ngx-stripe';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [UserSubscriptionContainerComponent],
  imports: [UiSharedModule, NgxStripeModule.forRoot(environment.stripeKey), NzGridModule],
  exports: [UserSubscriptionContainerComponent],
  providers: [
    { provide: SUBSCRIPTIONS_API_SERVICE, useExisting: SubscriptionsApiService },
    { provide: PAYMENTS_API_SERVICE, useExisting: PaymentsApiService },
    { provide: DISPLAY_NOTIFICATION_SERVICE, useExisting: DisplayNotificationService },
    { provide: ENVIRONMENT, useExisting: environment },
  ],
})
export class UserSubscriptionContainerModule {}
