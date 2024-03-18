import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoActiveSubscriptionModalComponent } from '@audience-app/auth/no-active-subscription-modal/no-active-subscription-modal.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  DISPLAY_NOTIFICATION_SERVICE,
  ENVIRONMENT,
  PAYMENTS_API_SERVICE,
  SubscriptionService,
  SUBSCRIPTIONS_API_SERVICE,
} from '@instigo-app/ui/shared';
import { PaymentsApiService } from '@audience-app/api/subscriptions-api/payments.api.service';
import SubscriptionsApiService from '@audience-app/api/subscriptions-api/subscriptions-api.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';

@NgModule({
  declarations: [NoActiveSubscriptionModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzTypographyModule,
    NzGridModule,
    NzButtonModule,
    NzSpinModule,
    NzToolTipModule,
    NzFormModule,
    NgxStripeModule.forRoot(environment.stripeKey),
  ],
  providers: [
    SubscriptionService,
    { provide: SUBSCRIPTIONS_API_SERVICE, useExisting: SubscriptionsApiService },
    { provide: PAYMENTS_API_SERVICE, useExisting: PaymentsApiService },
    { provide: DISPLAY_NOTIFICATION_SERVICE, useExisting: DisplayNotificationService },
    { provide: ENVIRONMENT, useExisting: environment },
  ],
})
export class NoActiveSubscriptionModal {}
