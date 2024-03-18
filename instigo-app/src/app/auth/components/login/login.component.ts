import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { AuthService } from '@app/auth/auth.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFrom: FormGroup;
  subsink = new SubSink();

  constructor(
    private fb: FormBuilder,
    private readonly authApiService: AuthApiService,
    private readonly authService: AuthService,
    private analytics: AnalyticsService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new StateResetAll());
    this.loginFrom = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.loginFrom.valid) {
      this.authService.loadingSpinner({ show: true });
      const { email } = this.loginFrom.controls;
      const { password } = this.loginFrom.controls;
      this.subsink.sink = this.authApiService.basingSignIn({ email: email.value, password: password.value }).subscribe(
        (response: any) => {
          this.analytics.sendEvent({
            event: 'Auth',
            action: 'login_success',
            data: { event: 'Auth', loggedUser: email.value },
          });
          this.authService.loadingSpinner({ show: false });
          this.authService.navigate({ path: `token/${response.token}` });
        },
        (error) => {
          this.analytics.sendEvent({
            event: 'Auth',
            action: 'login_fail',
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
