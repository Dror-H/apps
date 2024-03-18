import { Component, OnInit } from '@angular/core';
import { UserApiService } from '@app/api/services/user.api.service';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { Loading, User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-account-control-workspaces-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
})
export class WorkspaceListComponent implements OnInit {
  @Select(UserState.get)
  getUser$: Observable<User>;

  @Emitter(UserState.set)
  setUser: Emittable<string>;

  @Select(WorkspaceState.get)
  currentWorkspace$: Observable<WorkspaceDTO>;

  public assignedWorkspaces: Observable<WorkspaceDTO[]>;

  constructor(
    private store: Store,
    private displayNotification: DisplayNotification,
    public userApiService: UserApiService,
    public workspaceApiService: WorkspaceApiService,
  ) {}

  ngOnInit(): void {
    this.assignedWorkspaces = this.workspaceApiService.findAll();
  }

  public createWorkspace(workspace: Partial<WorkspaceDTO>): void {
    this.store.dispatch(new Loading({ loading: true }));
    this.workspaceApiService.create({ payload: workspace }).subscribe(
      () => {
        window.location.reload();
        this.refreshUser();
      },
      (error) => {
        this.handleError(error);
      },
      () => {
        this.store.dispatch(new Loading({ loading: false }));
      },
    );
  }

  public isDisabledCreateWorkspace() {
    return this.store.select(UserState.get).pipe(
      switchMap((user) => {
        if (user.ownedWorkspace.length === 0) {
          return of(false);
        }
        return of(!user?.subscriptionStatus);
      }),
    );
  }

  private handleError(error): void {
    this.displayNotification.displayNotification(
      new Notification({
        titleId: `app.register.${error.status}`,
        type: NotificationType.ERROR,
      }),
    );
  }

  private refreshUser() {
    this.userApiService.me().subscribe(
      (user: any) => {
        this.setUser.emit(user);
      },
      (error) => {
        this.handleError(error);
      },
    );
  }
}
