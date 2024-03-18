import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { StripeCardElementChangeEvent, StripeCardElementOptions } from '@stripe/stripe-js';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { OnboardingService } from '../onboarding.service';
import { CreateWorkspaceComponent } from './create-workspace.component';

@Component({
  selector: 'ngx-stripe-card',
  template: '<div></div>',
})
class NgxStripeCardMockComponent {
  @Input() options: StripeCardElementOptions;
  @Output() change = new EventEmitter<StripeCardElementChangeEvent>();
}

describe('CreateWorkspaceComponent: ', () => {
  let component: CreateWorkspaceComponent;
  let fixture: ComponentFixture<CreateWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NzDividerModule,
        NgxsModule.forRoot([]),
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [CreateWorkspaceComponent, NgxStripeCardMockComponent],
      providers: [
        { provide: AnalyticsService, useValue: { sendValue: () => {} } },
        { provide: OnboardingService, useValue: { assignCardToUser: () => {} } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  describe('createWorkspaceForm', () => {
    it('should have required validator on workspace field', () => {
      const { createWorkspaceForm } = component;
      const workspaceControl = component.createWorkspaceForm.get('workspace');
      workspaceControl.setValue('test');
      expect(createWorkspaceForm.valid).toBeTruthy();
    });

    // it('should submit if all values are present and stripe event has empty: false and errors: undefined', () => {
    //   const { createWorkspaceForm } = component;
    //   const workspaceControl = createWorkspaceForm.get('workspace');
    //   workspaceControl.setValue('test');
    // const cardDataControl = createWorkspaceForm.get('cardData');
    // const stripeEvent: StripeCardElementChangeEvent = {
    //   elementType: 'card',
    //   value: { postalCode: '00' },
    //   brand: 'visa',
    //   empty: false,
    //   complete: false,
    //   error: undefined,
    // };
    // cardDataControl.setValue(stripeEvent);
    // expect(createWorkspaceForm.valid).toBeTruthy();
    // });
    // it('should not submit if cardData input does not have truthy value', () => {
    //   const { createWorkspaceForm } = componentRefInner;
    //   const workspaceControl = createWorkspaceForm.get('workspace');
    //   workspaceControl.setValue('test');
    //   expect(createWorkspaceForm.invalid).toBeTruthy();
    // });
    // it('should update cardData on stripe change event', () => {
    //   const { createWorkspaceForm } = componentRefInner;
    //   const cardDataControl = createWorkspaceForm.get('cardData');
    //   const stripeEvent: StripeCardElementChangeEvent = {
    //     elementType: 'card',
    //     value: { postalCode: '00' },
    //     brand: 'visa',
    //     empty: false,
    //     complete: false,
    //     error: undefined,
    //   };
    //   component.onStripeChange(stripeEvent);
    //   expect(cardDataControl.value).toEqual(stripeEvent);
    // });
    // it('should not submit if stripe event has error', () => {
    //   const { createWorkspaceForm } = componentRefInner;
    //   const workspaceControl = createWorkspaceForm.get('workspace');
    //   workspaceControl.setValue('test');
    //   const cardDataControl = createWorkspaceForm.get('cardData');
    //   const stripeErroredEvent: StripeCardElementChangeEvent = {
    //     elementType: 'card',
    //     value: { postalCode: '00' },
    //     brand: 'visa',
    //     empty: false,
    //     complete: false,
    //     error: {
    //       type: 'validation_error',
    //       code: '403',
    //       message: 'Your card was declined. Authentication required',
    //     },
    //   };
    //   componentRefInner.onStripeChange(stripeErroredEvent);
    //   expect(cardDataControl.errors.invalidCard).toEqual(stripeErroredEvent.error.message);
    // });
    // it('should not submit if stripe event has empty: true', () => {
    //   const { createWorkspaceForm } = componentRefInner;
    //   const workspaceControl = createWorkspaceForm.get('workspace');
    //   workspaceControl.setValue('test');
    //   const cardDataControl = createWorkspaceForm.get('cardData');
    //   const stripeErroredEvent: StripeCardElementChangeEvent = {
    //     elementType: 'card',
    //     value: { postalCode: '00' },
    //     brand: 'visa',
    //     empty: true,
    //     complete: false,
    //     error: undefined,
    //   };
    //   componentRefInner.onStripeChange(stripeErroredEvent);
    //   expect(cardDataControl.errors.invalidCard).toBeTruthy();
    // });
  });
});
