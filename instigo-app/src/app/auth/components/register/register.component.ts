import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { AuthService } from '@app/auth/auth.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import {
  lowerCaseRegex,
  numberRegex,
  patternValidator,
  upperCaseRegex,
} from '@app/shared/shared/custom-form.validators';
import { CustomValidators } from 'ngx-custom-validators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  subsink = new SubSink();
  showPasswordTip: boolean;
  showPasswordVerifyTip: boolean;

  constructor(
    @Inject('LOGIN_PAGE') private LOGIN_PAGE: string,
    private fb: FormBuilder,
    private readonly authApiService: AuthApiService,
    private readonly authService: AuthService,
    private analytics: AnalyticsService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const password = new FormControl(null, [
      Validators.required,
      patternValidator(numberRegex, { hasNumber: true }),
      patternValidator(upperCaseRegex, { hasCapitalCase: true }),
      patternValidator(lowerCaseRegex, { hasSmallCase: true }),
      Validators.minLength(8),
    ]);
    const repeatPassword = new FormControl(null, [
      Validators.required,
      CustomValidators.equalTo(password as any),
    ] as any);
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password,
      repeatPassword,
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.email) {
        this.registerForm.get('email').patchValue(params.email);
      }
    });
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.authService.loadingSpinner({ show: true });
      const { password, email } = this.registerForm.controls;
      this.subsink.sink = this.authApiService.basingSignUp({ email: email.value, password: password.value }).subscribe(
        (response: any) => {
          this.analytics.sendEvent({
            event: 'Auth',
            action: 'signup_success',
            data: { event: 'Auth', loggedUser: email.value },
          });
          this.authService.loadingSpinner({ show: false });
          this.authService.showNotification({ notificationId: 'app.register.accountSuccessfullyCreated' });
          this.authService.navigate({ path: `/token/${response.token}` });
        },
        (error) => {
          this.analytics.sendEvent({
            event: 'Auth',
            action: 'signup_fail',
            data: { event: 'Auth', loggedUser: email.value },
          });
          this.authService.loadingSpinner({ show: false });
          this.authService.throwError(error);
        },
      );
    } else {
      this.authService.throwError({ error: { statusCode: 'empty' } });
    }
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }
}
