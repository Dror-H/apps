import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import {
  lowerCaseRegex,
  numberRegex,
  patternValidator,
  upperCaseRegex,
} from '@app/shared/shared/custom-form.validators';
import { Loading, User } from '@instigo-app/data-transfer-object';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { CustomValidators } from 'ngx-custom-validators';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  user: User;

  @Select(UserState.get)
  getUser$: Observable<User>;

  subsink = new SubSink();

  constructor(
    @Inject('LOGIN_PAGE') private LOGIN_PAGE: string,
    private fb: FormBuilder,
    private readonly authService: AuthApiService,
    private store: Store,
    private displayNotification: DisplayNotification,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.subsink.sink = this.getUser$.pipe(take(1)).subscribe((user: User) => {
      this.user = user;
    });
    const password = new FormControl(null, [
      Validators.required,
      patternValidator(numberRegex, { hasNumber: true }),
      patternValidator(upperCaseRegex, { hasCapitalCase: true }),
      patternValidator(lowerCaseRegex, { hasSmallCase: true }),
      Validators.minLength(8),
    ]);
    const repeatPassword = new FormControl(null, [
      Validators.required,
      CustomValidators.equalTo(password as any) as any,
    ]);
    this.resetPasswordForm = this.fb.group({
      password,
      repeatPassword,
    });
  }

  submitForm(): void {
    if (this.resetPasswordForm.valid) {
      this.store.dispatch(new Loading({ loading: true }));
      const { password } = this.resetPasswordForm.controls;
      this.subsink.sink = this.authService
        .resetPassword({ email: this.user.email, password: password.value })
        .subscribe(
          () => {
            this.analytics.sendEvent({
              event: 'Auth',
              action: 'passreset_success',
              data: { event: 'Auth' },
            });
            this.store.dispatch([
              new StateResetAll(),
              new Loading({ loading: false }),
              new Navigate([this.LOGIN_PAGE]),
            ]);
          },
          (error) => {
            this.analytics.sendEvent({
              event: 'Auth',
              action: 'passreset_failed',
              data: { event: 'Auth' },
            });
            this.store.dispatch([new Loading({ loading: false })]);
            this.displayNotification.displayNotification(
              new Notification({
                titleId: `app.register.${error.status}`,
                type: NotificationType.ERROR,
              }),
            );
          },
        );
    }
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }
}
