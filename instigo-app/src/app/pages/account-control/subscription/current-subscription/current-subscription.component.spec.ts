import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RxStore } from '@instigo-app/data-transfer-object';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SubscriptionService } from '../subscription.service';
import { CurrentSubscriptionComponent } from './current-subscription.component';

@Component({
  template: `<div></div>`,
  selector: 'ingo-change-payment-method',
})
class MockChangePaymentMethodComponent {}

describe('CurrentSubscriptionComponent ', () => {
  let component: CurrentSubscriptionComponent;
  let fixture: ComponentFixture<CurrentSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentSubscriptionComponent, MockChangePaymentMethodComponent],
      imports: [
        NzCardModule,
        NzTagModule,
        NzGridModule,
        NzListModule,
        NzProgressModule,
        NzSkeletonModule,
        NzDividerModule,
        NzCardModule,
      ],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            initialize: jest.fn(),
            currentSubscription$: new RxStore<any>({
              id: 'sub_1Jeb3FKlYpB2IMP7QS0jdlmV',
              nextPayment: '01/10/2021',
              quantity: 1,
              billingCycle: 'quarterly',
              latestInvoice: 'in_1Jeb3FKlYpB2IMP7OYgPNii3',
              planCost: 19,
              spendCap: 1,
              cancelAtPeriodEnd: true,
              used: 758.038,
              status: '0',
              active: true,
              color: '#7ed321',
              label: 'Active',
            }),
            currentPaymentMethod$: new RxStore<any>(undefined),
          },
        },
        { provide: NzModalService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
