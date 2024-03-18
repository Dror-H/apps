import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@audience-app/global/models/app.models';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { UserState } from '@audience-app/store/user.state';
import { SubscriptionService, UserPaymentCardData } from '@instigo-app/ui/shared';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { Observable } from 'rxjs';
import { tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'ingo-no-active-subscription-modal',
  templateUrl: './no-active-subscription-modal.component.html',
  styleUrls: ['./no-active-subscription-modal.component.scss'],
})
export class NoActiveSubscriptionModalComponent implements OnInit {
  @SelectSnapshot(UserState.getUserAndAdAccounts) user: User;
  @ViewChild(StripeCardComponent) public card: StripeCardComponent;
  public paymentForm: FormGroup = new FormGroup({
    name: new FormControl(''),
  });
  public cardData: UserPaymentCardData;
  public isLoading = false;

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

  constructor(
    private subscriptionService: SubscriptionService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      coupon: [''],
    });
    this.getCurrentPaymentMethod();
  }

  public closeModal(): void {
    this.modalService.closeModal();
  }

  public pay(): void {
    this.isLoading = true;
    this.subscriptionService
      .pay()
      .pipe(
        tap(() => this.closeModal()),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }

  private getCurrentPaymentMethod(): void {
    this.getCurrentPaymentMethod$(true).subscribe();
  }

  private getCurrentPaymentMethod$(disableWhileLoading: boolean): Observable<UserPaymentCardData> {
    if (disableWhileLoading) {
      this.isLoading = true;
    }

    return this.subscriptionService.paymentMethod().pipe(
      tap((res) => (this.cardData = res)),
      finalize(() => {
        if (disableWhileLoading) {
          this.isLoading = false;
        }
      }),
    );
  }
}
