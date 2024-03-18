import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserState } from '@app/global/user.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import { StripeCardComponent } from 'ngx-stripe';
import { slideUp } from '../animations';
import { OnboardingState, OnboardingStateModel } from '../onboarding.state';
import { User } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  animations: [slideUp],
})
export class CreateWorkspaceComponent implements OnInit {
  @SelectSnapshot(UserState.get) public user: User;
  @ViewChild(StripeCardComponent) public card: StripeCardComponent;

  public createWorkspaceForm: FormGroup;
  public stripeCardElementOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        backgroundColor: '#ffffff',
        color: '#393b4b',
        fontFamily: 'proxima-nova, sans-serif',
        fontSize: '15px',
        iconColor: '#5f63f2',
        letterSpacing: '0',
        '::placeholder': {
          color: '#90929d',
          fontWeight: '200',
        },
      },
    },
  };

  @Emitter(OnboardingState.update) updateOnboarding: Emittable<Partial<OnboardingStateModel>>;

  constructor(private formBuilder: FormBuilder, private analytics: AnalyticsService) {}
  //* removed temporary
  // private onboardingService: OnboardingService,

  ngOnInit(): void {
    this.createWorkspaceForm = this.formBuilder.group({
      workspace: ['', [Validators.required, Validators.minLength(3)]],
      //* removed temporary
      // cardData: [null, [customStripeCardValidator, Validators.required]],
    });
  }

  //* removed temporary
  // public onStripeChange(ev: StripeCardElementChangeEvent): void {
  //   this.createWorkspaceForm.get('cardData').setValue(ev);
  // }

  public submitForm(): void {
    if (this.createWorkspaceForm.invalid) {
      this.createWorkspaceForm.markAllAsTouched();
    }

    const { workspace } = this.createWorkspaceForm.value;
    this.sendAnalyticsEvent();
    this.updateOnboarding.emit({ step: 3, workspace });

    //* removed temporary
    // this.assignCardToUser();
  }

  private sendAnalyticsEvent(): void {
    this.analytics.sendEvent({
      event: 'Onboarding',
      action: 'step_completed',
      data: {
        event: 'Onboarding',
        step: '02_create_workspace',
      },
    });
  }

  //* removed temporary
  // private assignCardToUser(): Subscription {
  //   return this.onboardingService
  //     .assignCardToUser({ user: this.user, card: this.card })
  //     .pipe(
  //       tap(() => {
  //         const { workspace } = this.createWorkspaceForm.value;
  //         this.sendAnalyticsEvent();
  //         this.updateOnboarding.emit({ step: 3, workspace });
  //       }),
  //     )
  //     .subscribe();
  // }
}
