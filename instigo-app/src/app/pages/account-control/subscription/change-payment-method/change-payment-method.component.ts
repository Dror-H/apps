import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'ingo-change-payment-method',
  templateUrl: './change-payment-method.component.html',
  styleUrls: ['./change-payment-method.component.scss'],
})
export class ChangePaymentMethodComponent implements OnInit {
  @ViewChild(StripeCardComponent)
  public card: StripeCardComponent;

  public isChangingPayMethod = false;
  public stripeCardElementOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#5f63f2',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: 'proxima-nova, Helvetica, sans-serif',
        fontSize: '14px',
        '::placeholder': {
          fontSize: '14px',
          color: '#aab3bb',
        },
      },
    },
  };
  public stripeElementsOptions: StripeElementsOptions = { locale: 'auto' };

  public paymentForm: FormGroup;
  public currentPaymentMethod$;

  @ViewChild('modal')
  public modal: TemplateRef<any>;

  @SelectSnapshot(UserState.get)
  public user: User;

  constructor(private readonly formBuilder: FormBuilder, private readonly subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      name: [this.user.fullName, Validators.required],
    });
    this.currentPaymentMethod$ = this.subscriptionService.currentPaymentMethod$.state$;
  }

  public updatePaymentMethod(): void {
    this.subscriptionService.updatePaymentMethod({ user: this.user, card: this.card }).subscribe(() => {
      this.subscriptionService.paymentMethod().subscribe((result) => {
        if (result) {
          this.subscriptionService.currentPaymentMethod$.patchState(result);
          this.isChangingPayMethod = false;
        }
      });
    });
  }
}
