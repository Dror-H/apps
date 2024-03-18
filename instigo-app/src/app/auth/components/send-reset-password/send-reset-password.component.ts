import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { Loading } from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-send-reset-password',
  templateUrl: './send-reset-password.component.html',
  styleUrls: ['./send-reset-password.component.scss'],
})
export class SendResetPasswordComponent implements OnInit, OnDestroy {
  public sendEmailForm: FormGroup;
  public isSent: boolean;

  private subSink = new SubSink();

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthApiService,
    private readonly store: Store,
    private displayNotification: DisplayNotification,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.sendEmailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submitForm(): void {
    if (this.sendEmailForm.valid) {
      this.store.dispatch(new Loading({ loading: true }));
      const { email } = this.sendEmailForm.controls;
      this.isSent = true;
      this.subSink.sink = this.authService.sendResetPasswordEmail({ user: { email: email.value } }).subscribe(
        (res) => {
          this.analytics.sendEvent({
            event: 'Auth',
            action: 'send_passreset_success',
            data: { event: 'Auth', loggedUser: email.value },
          });
          this.store.dispatch([new Loading({ loading: false })]);
          this.displayNotification.displayNotification(
            new Notification({
              titleId: `app.sendResetPassword.successTitle`,
              contentId: `app.sendResetPassword.successMessage`,
              type: NotificationType.SUCCESS,
            }),
          );
        },
        (err) => {
          this.analytics.sendEvent({
            event: 'Auth',
            action: 'send_passreset_failed',
            data: { event: 'Auth', loggedUser: email.value },
          });
          this.isSent = false;
          this.store.dispatch([new Loading({ loading: false })]);
          this.displayNotification.displayNotification(
            new Notification({
              titleId: `app.sendResetPassword.errorTitle`,
              contentId: `app.sendResetPassword.errorMessage`,
              type: NotificationType.ERROR,
            }),
          );
        },
      );
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
