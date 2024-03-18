import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@app/api/services/user.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';
import { CustomValidators } from 'ngx-custom-validators';
import { patternValidator } from '@app/shared/shared/custom-form.validators';
import { AuthApiService } from '@app/api/services/auth.api.service';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { Loading, User } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-account-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.scss'],
})
export class AccountSecurityComponent implements OnInit {
  public sessionHistory$: Observable<any>;
  public changePasswordForm: FormGroup;
  public submit: boolean;
  public isPasswordEdit = false;
  @SelectSnapshot(UserState.get) user: User;
  @Emitter(UserState.update)
  private updateUser: Emittable<Partial<User>>;

  constructor(
    public formBuilder: FormBuilder,
    private readonly userApiService: UserApiService,
    private displayNotification: DisplayNotification,
    private store: Store,
    private readonly authService: AuthApiService,
  ) {}

  public get isPasswordRepeatValid(): boolean {
    return this.changePasswordForm.valid;
  }

  ngOnInit(): void {
    this.sessionHistory$ = this.userApiService.deviceLoginHistory();
    this.setForm();
    this.submit = false;
  }

  public cancelFormEdit(): void {
    this.changePasswordForm.reset();
    this.isPasswordEdit = false;
  }

  public sendResetPassword(): any {
    return this.authService.sendResetPasswordEmail({ user: { email: this.user.email } }).subscribe(
      (res) => {
        this.displayNotification.displayNotification(
          new Notification({
            titleId: `app.sendResetPassword.successTitle`,
            contentId: `app.sendResetPassword.successMessage`,
            type: NotificationType.SUCCESS,
          }),
        );
      },
      (err) => {
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

  public async updateData(): Promise<void> {
    try {
      this.isPasswordEdit = false;
      const values = this.changePasswordForm.value;
      delete values.repeatPassword;
      const updatedUser = await this.userApiService.changePassword({ payload: { ...values } }).toPromise();
      this.updateUser.emit(updatedUser);
      this.changePasswordForm.reset();

      this.store.dispatch([new Loading({ loading: false })]);
      this.displayNotification.displayNotification(
        new Notification({ titleId: `app.profile.accountSecurity.successMessage`, type: NotificationType.SUCCESS }),
      );
    } catch (err) {
      this.displayNotification.displayNotification(
        new Notification({ titleId: `app.profile.accountSecurity.errorMessage`, type: NotificationType.ERROR }),
      );
    }
  }

  public setForm() {
    const password = new FormControl(null, [
      Validators.required,
      // 2. check whether the entered password has a number
      patternValidator(/\d/, { hasNumber: true }),
      // 3. check whether the entered password has upper case letter
      patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      // 4. check whether the entered password has a lower-case letter
      patternValidator(/[a-z]/, { hasSmallCase: true }),
      Validators.minLength(8),
    ]);
    const repeatPassword = new FormControl(null, [
      Validators.required,
      CustomValidators.equalTo(password as any),
    ] as any);
    this.changePasswordForm = this.formBuilder.group({
      previousPassword: [null, [Validators.required]],
      password,
      repeatPassword,
    });
  }
}
