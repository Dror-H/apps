import { Component } from '@angular/core';
import { UserApiService } from '@app/api/services/user.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { LogoutService } from '@app/global/logout.service';
import { Loading, NotificationType } from '@instigo-app/data-transfer-object';
import { Store } from '@ngxs/store';

@Component({
  selector: 'ingo-account-deletion',
  templateUrl: './account-deletion.component.html',
})
export class AccountDeletionComponent {
  public isDeleteModalVisible = false;

  constructor(
    private readonly store: Store,
    private readonly userApiService: UserApiService,
    private readonly logoutService: LogoutService,
    private readonly displayNotification: DisplayNotification,
  ) {}

  public showDeleteAccountModal(): void {
    this.isDeleteModalVisible = true;
  }

  public deleteAccount() {
    this.handleCancel();
    this.store.dispatch(new Loading({ loading: true }));
    this.userApiService.deleteMe().subscribe({
      complete: () => this.logoutUser(),
      error: (error) => this.handleError(error),
    });
  }

  public handleCancel(): void {
    this.isDeleteModalVisible = false;
  }

  private handleError(error) {
    this.store.dispatch([new Loading({ loading: false })]);
    this.displayNotification.displayNotification(
      new Notification({
        titleId: `app.register.${error.status}`,
        type: NotificationType.ERROR,
      }),
    );
  }

  private logoutUser() {
    this.store.dispatch(new Loading({ loading: false }));
    this.logoutService.logout();
  }
}
