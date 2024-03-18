import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DateFnsModule } from 'ngx-date-fns';
import { NgPipesModule } from 'ngx-pipes';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { ChangePaymentMethodComponent } from './change-payment-method/change-payment-method.component';
import { CurrentSubscriptionComponent } from './current-subscription/current-subscription.component';
import { SubscriptionPickerComponent } from './subscription-plan-picker/subscription-picker.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionService } from './subscription.service';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  imports: [
    NgxStripeModule.forRoot(environment.stripeKey),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    DateFnsModule,
    UiSharedModule,
    NgxSpinnerModule,
    SubscriptionRoutingModule,
    NzGridModule,
    NzCardModule,
    NzListModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzNotificationModule,
    NzTabsModule,
    NzToolTipModule,
    NzSliderModule,
    NzProgressModule,
    NzTagModule,
    NzSkeletonModule,
    NzResultModule,
  ],
  declarations: [SubscriptionPickerComponent, CurrentSubscriptionComponent, ChangePaymentMethodComponent],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
