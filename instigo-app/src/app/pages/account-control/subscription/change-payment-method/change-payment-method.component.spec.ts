import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxStore } from '@instigo-app/data-transfer-object';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SubscriptionService } from '../subscription.service';
import { ChangePaymentMethodComponent } from './change-payment-method.component';

@Directive({
  selector: '[ngxStripeCardGroup]',
})
class MockStripeCardGroupDirective {
  @Input() elementsOptions;
}

@Component({
  selector: 'ngx-stripe-card',
  template: `<div></div>`,
})
class MockStripeCardComponent {
  @Input() options;
}
@Component({
  selector: 'ngx-stripe-payment-request-button',
  template: `<div></div>`,
})
class MockStripePaymentRequestButtonComponent {}

const mocks = [MockStripeCardGroupDirective, MockStripeCardComponent, MockStripePaymentRequestButtonComponent];

describe('ChangePaymentMethodComponent', () => {
  let component: ChangePaymentMethodComponent;
  let fixture: ComponentFixture<ChangePaymentMethodComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreTestBedModule.configureTestingModule([]),
        NgxsSelectSnapshotModule.forRoot(),
        NzGridModule,
        NzButtonModule,
        NzToolTipModule,
      ],
      declarations: [ChangePaymentMethodComponent, ...mocks],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            initialize: jest.fn(),
            currentSubscription$: new RxStore<any>(undefined),
            currentPaymentMethod$: new RxStore<any>(undefined),
          },
        },
      ],
    }).compileComponents();
    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePaymentMethodComponent);
    component = fixture.componentInstance;
    jest.spyOn(component as any, 'user', 'get').mockReturnValue({ fullName: 'John Doe' });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
