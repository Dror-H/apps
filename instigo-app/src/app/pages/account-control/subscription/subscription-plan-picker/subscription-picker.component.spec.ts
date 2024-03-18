import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxStore } from '@instigo-app/data-transfer-object';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalService } from 'ng-zorro-antd/modal';
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
import { SubscriptionService } from '../subscription.service';
import { SubscriptionPickerComponent } from './subscription-picker.component';

@Component({
  template: `<div></div>`,
  selector: 'ingo-current-subscription',
})
class MockCurrentSubscriptionComponent {}

describe('ReplaceWithYourComponent: ', () => {
  let component: SubscriptionPickerComponent;
  let fixture: ComponentFixture<SubscriptionPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DateFnsModule,
        NzGridModule,
        NzInputModule,
        NzListModule,
        NzNotificationModule,
        NzProgressModule,
        NzRadioModule,
        NzResultModule,
        NzSkeletonModule,
        NzSliderModule,
        NzTableModule,
        NzTabsModule,
        NzTagModule,
        NzToolTipModule,
        NzCardModule,
        NzDividerModule,
      ],
      declarations: [SubscriptionPickerComponent, MockCurrentSubscriptionComponent],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            initialize: jest.fn(),
            currentSubscription$: new RxStore(undefined),
            currentPaymentMethod$: new RxStore(undefined),
          },
        },
        { provide: NzModalService, useValue: { create: jest.fn() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 1, 1));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get nextRenew next month', () => {
    component.subscriptionForm.controls.billingCycle.setValue('monthly');
    const next = component.nextRenew;
    expect(next).toEqual('Mon, Mar 2nd, 2020');
  });

  it('should get nextRenew next quarter', () => {
    component.subscriptionForm.controls.billingCycle.setValue('quarter');
    const next = component.nextRenew;
    expect(next).toEqual('Fri, May 1st, 2020');
  });

  it('should get nextRenew next annual', () => {
    component.subscriptionForm.controls.billingCycle.setValue('annual');
    const next = component.nextRenew;
    expect(next).toEqual('Mon, Feb 1st, 2021');
  });

  it('should get total months', () => {
    const total = (component as any).totalMonths('monthly');
    expect(total).toEqual(1);
  });
  it('should get total quarter', () => {
    const total = (component as any).totalMonths('quarter');
    expect(total).toEqual(3);
  });

  it('should get total annual', () => {
    const total = (component as any).totalMonths('annual');
    expect(total).toEqual(12);
  });

  it('should get total', () => {
    const total = (component as any).getTotal({ subTotal: 19, billingCycle: 'month' });
    expect(total).toEqual(19);
  });

  it('should get total', () => {
    const total = (component as any).getTotal({ subTotal: 19, billingCycle: 'quarter' });
    expect(total).toEqual(17);
  });

  it('should get total', () => {
    const total = (component as any).getTotal({ subTotal: 19, billingCycle: 'annual' });
    expect(total).toEqual(15);
  });

  it('should get total', () => {
    const total = (component as any).getTotal({
      subTotal: 19,
      billingCycle: 'month',
      coupon: {
        percent_off: 10,
      },
    });
    expect(total).toEqual(17.1);
  });

  it('should get total', () => {
    const total = (component as any).getTotal({
      subTotal: 19,
      billingCycle: 'month',
      coupon: {
        amount_off: 1000,
      },
    });
    expect(total).toEqual(9);
  });
});
