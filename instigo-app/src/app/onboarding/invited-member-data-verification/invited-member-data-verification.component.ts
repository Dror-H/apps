import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { SubSink } from 'subsink';
import { slideUp } from '../animations';
import { OnboardingService } from '../onboarding.service';
import { User } from '@instigo-app/data-transfer-object';
import { patternValidator } from '@app/shared/shared/custom-form.validators';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';

@Component({
  selector: 'app-invited-member-data-verification',
  templateUrl: './invited-member-data-verification.component.html',
  styleUrls: ['./invited-member-data-verification.component.scss'],
  animations: [slideUp],
})
export class InvitedMemberDataVerificationComponent implements OnInit, OnDestroy {
  public dataValidationForm: FormGroup;
  public user: User;
  private subscriptions = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private onboarding: OnboardingService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    const password = new FormControl(null, [
      // 1. Password Field is Required
      Validators.required,
      // 2. check whether the entered password has a number
      patternValidator(/\d/, { hasNumber: true }),
      // 3. check whether the entered password has upper case letter
      patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      // 4. check whether the entered password has a lower-case letter
      patternValidator(/[a-z]/, { hasSmallCase: true }),
      // 6. Has a minimum length of 8 characters
      Validators.minLength(8),
    ]);

    const repeatPassword = new FormControl(null, [
      Validators.required,
      CustomValidators.equalTo(password as any),
    ] as any);

    this.dataValidationForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email, Validators.minLength(2)]],
      password,
      repeatPassword,
    });

    this.subscriptions.sink = this.onboarding.getUser$.subscribe((user: User) => {
      this.dataValidationForm.patchValue({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitForm() {
    if (this.dataValidationForm.invalid) {
      this.dataValidationForm.markAllAsTouched();
      return;
    }
    const { firstName, lastName, email, password } = this.dataValidationForm.controls;
    this.analytics.sendEvent({
      event: 'Onboarding',
      action: 'step_completed',
      data: {
        event: 'Onboarding',
        step: '01_validate',
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        isInvite: true,
      },
    });
    return this.onboarding.validateDataForInvitedMember({
      user: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      },
    });
  }
}
