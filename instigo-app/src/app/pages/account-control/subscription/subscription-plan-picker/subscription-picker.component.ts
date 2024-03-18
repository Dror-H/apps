import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { slideUp } from '@app/widgets/shared/animation';
import {
  availablePlans,
  SubscriptionPlan,
  SubscriptionStatus,
  subscriptionStatus,
} from '@instigo-app/data-transfer-object';
import { addDays, addMonths, addYears, format } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'ingo-subscription-picker',
  templateUrl: './subscription-picker.component.html',
  styleUrls: ['./subscription-picker.component.scss'],
  animations: [slideUp],
})
export class SubscriptionPickerComponent implements OnInit, OnDestroy {
  @ViewChild('changePlanModalContent')
  public changePlanModalContent: TemplateRef<any>;

  @ViewChild('changePlanModalFooter')
  public changePlanModalFooter: TemplateRef<any>;

  public availablePlans: SubscriptionPlan[] = availablePlans;
  public subscriptionStatus: SubscriptionStatus[] = subscriptionStatus;
  public currentSubscription$: Observable<any>;
  public currentPaymentMethod$: Observable<any>;
  public isChangingSubscription = false;
  public haveCoupon = false;
  public isCancellingSubscription = false;
  public subscriptionForm: FormGroup;
  public discountedPrices: { [k: string]: number } = { month: 1, quarter: 0.9, annual: 0.8 };
  public timeNow: Date = new Date();
  private subscriptions = new SubSink();

  public get selectedPlan(): any {
    return this.availablePlans.find((p) => p.id === this.subscriptionForm.get('plan').value);
  }

  public get billingCycle(): string {
    return this.subscriptionForm.get('billingCycle').value;
  }

  private get billingCycleString() {
    if (this.billingCycle === 'annual') {
      return 'yearly';
    }
    if (this.billingCycle === 'quarter') {
      return 'quarterly';
    }
    return 'monthly';
  }

  public get total(): number {
    return this.subscriptionForm.get('total').value;
  }

  public get discount(): number {
    return this.subscriptionForm.get('discount').value;
  }

  public get subTotal(): number {
    return this.subscriptionForm.get('subTotal').value;
  }

  public get nextRenew(): string {
    const { billingCycle } = this.subscriptionForm.value;
    const now = new Date();
    if (billingCycle === 'quarter') {
      return format(addMonths(now, 3), 'iii, LLL do, yyyy');
    }
    if (billingCycle == 'annual') {
      return format(addYears(now, 1), 'iii, LLL do, yyyy');
    }
    return format(addDays(now, 30), 'iii, LLL do, yyyy');
  }

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly formBuilder: FormBuilder,
    private readonly modalService: NzModalService,
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptionService.initialize();
    this.subscriptionForm = this.formBuilder.group({
      billingCycle: ['month'],
      plan: [1],
      coupon: [''],
      total: [19],
      subTotal: [19],
      discount: [0],
    });
    this.currentSubscription$ = this.subscriptionService.currentSubscription$.state$;
    this.currentPaymentMethod$ = this.subscriptionService.currentPaymentMethod$.state$;
    this.subscriptions.sink = this.subscriptionForm.valueChanges
      .pipe(startWith(this.subscriptionForm.getRawValue()))
      .subscribe((form) => {
        this.updatePrices(form);
      });
  }

  private totalMonths(billingCycle): number {
    return billingCycle == 'annual' ? 12 : billingCycle == 'quarter' ? 3 : 1;
  }

  private getTotal({ subTotal, billingCycle, coupon }): number {
    const discountedPrices = { month: 1, quarter: 0.9, annual: 0.8 };
    let total = Math.floor(subTotal * discountedPrices[billingCycle]);
    if (coupon && coupon['percent_off']) {
      total = total - total * (coupon['percent_off'] / 100);
    }
    if (coupon && coupon['amount_off']) {
      total = total - coupon['amount_off'] / 100;
    }
    return total;
  }

  private isTheSameSubscriptionAsTheCurrentOne(plan) {
    return (
      this.subscriptionService.currentSubscription$.state?.quantity === plan &&
      this.subscriptionService.currentSubscription$.state?.billingCycle === this.billingCycleString &&
      this.subscriptionService.currentSubscription$.state?.active
    );
  }

  private updatePrices(form): void {
    const { coupon, billingCycle, plan } = form;
    const totalMonths = this.totalMonths(billingCycle);
    const subTotal = totalMonths * this.selectedPlan.price;
    const total = this.getTotal({ subTotal, billingCycle, coupon });
    this.subscriptionForm.get('discount').patchValue(subTotal - total, { emitEvent: false });
    this.subscriptionForm.get('total').patchValue(total, { emitEvent: false });
    this.subscriptionForm.get('subTotal').patchValue(subTotal, { emitEvent: false });
    if (this.isTheSameSubscriptionAsTheCurrentOne(plan)) {
      this.subscriptionForm.setErrors({ invalid: true });
    }
  }

  public confirmCancellation(): void {
    this.subscriptionService.deleteSubscription().subscribe();
  }

  public confirmNewPlan(): void {
    this.subscriptionService
      .pay({
        quantity: this.subscriptionForm.value.plan,
        billingCycle: this.subscriptionForm.value.billingCycle,
        coupon: this.subscriptionForm.value.coupon,
      })
      .subscribe(() => {
        this.isChangingSubscription = false;
        this.subscriptionForm.setErrors({ invalid: true });
        window.location.reload();
      });
  }

  public openConfirmModal(): void {
    this.subscriptionService.checkPaymentMethod();
    this.modalService.create({
      nzContent: this.changePlanModalContent,
      nzFooter: this.changePlanModalFooter,
      nzMaskClosable: false,
      nzClassName: 'ingo-subscription-modal confirm-modal',
      nzWidth: '500px',
    });
  }

  public checkPromoCode(code) {
    this.subscriptionService.checkPromoCode({ code }).subscribe((coupon) => {
      this.subscriptionForm.get('coupon').setValue(coupon);
    });
  }

  public removeDiscount(promoCode) {
    promoCode.value = '';
    this.subscriptionForm.get('coupon').patchValue('');
    this.subscriptionForm.get('discount').patchValue(0);
  }
}
