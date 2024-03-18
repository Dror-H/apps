import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { SubscriptionService } from '@instigo-app/ui/shared';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NoActiveSubscriptionModalComponent } from './no-active-subscription-modal.component';
import { Store } from '@ngxs/store';
import { UserState } from '@audience-app/store/user.state';
import { of } from 'rxjs';

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

describe('NoActiveSubscriptionModalComponent', () => {
  let component: NoActiveSubscriptionModalComponent;
  let fixture: ComponentFixture<NoActiveSubscriptionModalComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NoActiveSubscriptionModalComponent,
        MockStripeCardComponent,
        MockStripePaymentRequestButtonComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        NzTypographyModule,
        NzGridModule,
        NzButtonModule,
        NzSpinModule,
        NzToolTipModule,
        NzFormModule,
        NgxsSelectSnapshotModule,
        StoreTestBedModule.configureTestingModule([UserState]),
      ],
      providers: [
        { provide: ModalService, useValue: { closeModal: () => {} } },
        {
          provide: SubscriptionService,
          useValue: { updatePaymentMethod: () => of(), paymentMethod: () => of() },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.reset({ user: { name: '' } });
    fixture = TestBed.createComponent(NoActiveSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
