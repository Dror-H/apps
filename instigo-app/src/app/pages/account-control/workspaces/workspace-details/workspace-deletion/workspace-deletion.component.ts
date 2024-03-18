import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from '@app/api/services/user.api.service';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { Loading, NotificationType, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Store } from '@ngxs/store';

@Component({
  selector: 'ingo-workspace-deletion',
  templateUrl: './workspace-deletion.component.html',
})
export class WorkspaceDeletionComponent {
  @Input() workspace: WorkspaceDTO;

  @Emitter(UserState.set) setUser: Emittable<string>;

  public isDeleteModalVisible = false;

  constructor(
    private readonly store: Store,
    private readonly displayNotification: DisplayNotification,
    private readonly router: Router,
    private readonly userApiService: UserApiService,
    private readonly workspaceApiService: WorkspaceApiService,
  ) {}

  public isWorkspaceOwner(): boolean {
    return this.workspace.owner.id === this.store.selectSnapshot(UserState.get).id;
  }

  public showDeleteWorkspaceModal(): void {
    this.isDeleteModalVisible = true;
  }

  public deleteWorkspace() {
    this.onCancel();
    this.store.dispatch(new Loading({ loading: true }));
    this.workspaceApiService.disable({ workspaceId: this.workspace.id }).subscribe({
      complete: () => this.refreshUserAndRedirect(),
      error: (error) => this.handleError(error),
    });
  }

  public onCancel(): void {
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

  private refreshUserAndRedirect() {
    this.userApiService.me().subscribe({
      next: (user: any) => {
        this.store.dispatch(new Loading({ loading: false }));
        this.setUser.emit(user);
      },
      complete: () => this.router.navigateByUrl('/account-control/workspaces'),
      error: (error) => this.handleError(error),
    });
  }
}
