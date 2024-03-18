import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserApiService } from '@app/api/services/user.api.service';
import { WebsiteUserApiService } from '@app/api/services/website-user.api.service';
import { GetIpGeolocation, UserState } from '@app/global/user.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WorkspaceState } from './state/workspace.state';

@Injectable({ providedIn: 'root' })
export class PagesResolver implements Resolve<any> {
  // We need to keep track on if a request has already been sent
  requested = false;

  @Emitter(UserState.set)
  setUser: Emittable<Partial<User>>;

  @Emitter(WorkspaceState.set)
  setWorkspace: Emittable<Partial<WorkspaceDTO>>;

  @SelectSnapshot(WorkspaceState.get)
  private readonly workspace;

  constructor(
    private store: Store,
    private userApiService: UserApiService,
    private websiteUserApi: WebsiteUserApiService,
    private analytics: AnalyticsService,
  ) {}

  resolve(): any {
    if (!this.requested || this.workspace === null) {
      this.requested = true;
      return this.userApiService.me().pipe(
        switchMap((user: any) => {
          this.analytics.updateIntercom(user);
          this.analytics.updateSmartlook(user);
          this.store.dispatch(new GetIpGeolocation());
          const { assignedWorkspaces } = user;
          const defaultWorkspace =
            assignedWorkspaces.find((workspace) => workspace.id === user.settings?.defaultWorkspace) ??
            assignedWorkspaces[0];
          return combineLatest([this.setUser.emit(user), this.setWorkspace.emit(defaultWorkspace)]).pipe(
            map(() => 'done'),
          );
        }),
        catchError(() => {
          this.requested = false;
          return this.store.dispatch([new StateResetAll(), new Navigate([`auth/login`])]);
        }),
      );
    }
  }
}
