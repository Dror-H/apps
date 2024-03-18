import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserState } from '@app/global/user.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { User } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { slideUp } from '../animations';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-data-verification',
  templateUrl: './data-verification.component.html',
  styleUrls: ['./data-verification.component.scss'],
  animations: [slideUp],
})
export class DataVerificationComponent implements OnInit, OnDestroy {
  @SelectSnapshot(UserState.get) public user: User;
  public dataValidationForm: FormGroup;

  private subscriptions = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private onboarding: OnboardingService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.dataValidationForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.user.email, [Validators.required, Validators.email]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitForm() {
    const isFormValid = this.isFormValidAndHandleErrors();
    if (!isFormValid) {
      return;
    }
    this.sendAnalyticsEvent();
    return this.validateData().subscribe();
  }

  private isFormValidAndHandleErrors(): boolean {
    if (this.dataValidationForm.invalid) {
      this.markFormAsTouchedAndDirty();
      return false;
    }
    return true;
  }

  private markFormAsTouchedAndDirty() {
    this.dataValidationForm.markAllAsTouched();
    Object.keys(this.dataValidationForm.controls).forEach((controlName) => {
      this.dataValidationForm.get(controlName).markAsDirty();
    });
  }

  private sendAnalyticsEvent(): void {
    const { firstName, lastName, email } = this.dataValidationForm.controls;

    this.analytics.sendEvent({
      event: 'Onboarding',
      action: 'step_completed',
      data: {
        event: 'Onboarding',
        step: '01_validate',
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        isInvite: false,
      },
    });
  }

  private validateData(): Observable<any> {
    const { firstName, lastName, email } = this.dataValidationForm.controls;
    return this.onboarding.validateData({
      user: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        username: email.value.slice(0, email.value.indexOf('@')),
      },
    });
  }
}
