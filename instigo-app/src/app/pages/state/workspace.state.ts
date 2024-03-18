import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserApiService } from '@app/api/services/user.api.service';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { providerIcons } from '@app/global/constants';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { UserState } from '@app/global/user.state';
import { AdAccountDTO, SupportedProviders, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter, EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { isEmpty, isNil, isUndefined } from 'lodash-es';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { InitializeDashboard } from '../adaccount-dashboard/session-state.state';
import { environment } from '../../../environments/environment';

export class SwitchWorkspace {
  static readonly type = '[WORKSPACE] SWITCH';

  constructor(public selectedWorkspace: WorkspaceDTO) {}
}

export class SyncWorkspace {
  static readonly type = '[Workspace] SYNC';
}

export interface WorkspaceStateModel {
  workspace: WorkspaceDTO;
}

@State<WorkspaceStateModel>({
  name: 'workspace',
  defaults: {
    workspace: null,
  },
})
@Injectable()
export class WorkspaceState {
  @Emitter(UserState.set)
  setUser: Emittable<string>;

  constructor(
    private workspaceApiService: WorkspaceApiService,
    private userApiService: UserApiService,
    private displayNotification: DisplayNotification,
  ) {}

  @Receiver()
  public static set({ patchState }: StateContext<WorkspaceStateModel>, { payload }: EmitterAction<WorkspaceDTO>): void {
    patchState({ workspace: payload });
  }

  @Receiver()
  public static update(
    { patchState, getState }: StateContext<WorkspaceStateModel>,
    { payload }: EmitterAction<Partial<WorkspaceStateModel>>,
  ): void {
    patchState({ workspace: { ...getState().workspace, ...payload } });
  }

  @Selector()
  public static get(state: WorkspaceStateModel): WorkspaceDTO {
    return state.workspace;
  }

  @Selector()
  public static getAdAccountList(state: WorkspaceStateModel): AdAccountDTO[] {
    const { adAccounts } = state.workspace;
    return adAccounts.map((adAccount) => ({
      ...adAccount,
      label: adAccount.name,
    }));
  }

  @Selector()
  public static defaultCurrency(state: WorkspaceStateModel): string {
    return state.workspace?.settings?.defaultCurrency || 'USD';
  }

  @Selector()
  public static useCachedInsights(state: WorkspaceStateModel): boolean {
    return state.workspace?.settings?.useCachedInsights || false;
  }

  @Selector()
  public static workspaceId(state: WorkspaceStateModel): string {
    return state.workspace?.id;
  }

  @Selector()
  public static totalAdAccounts(state: WorkspaceStateModel): number {
    return state.workspace.adAccounts?.length || 0;
  }

  @Selector([UserState.get])
  public static isWorkspaceOwner(state: WorkspaceStateModel, user): boolean {
    return state.workspace.owner.id === user.id;
  }

  @Selector()
  public static adAccountsList(state: WorkspaceStateModel): AdAccountDTO[] {
    const enableLinkedin = environment.features.linkedin;
    const adAccountsList = state.workspace.adAccounts
      .filter(
        (adAccount) =>
          (adAccount.provider === SupportedProviders.LINKEDIN && enableLinkedin) ||
          adAccount.provider === SupportedProviders.FACEBOOK,
      )
      .map((adAccount) => ({
        ...adAccount,
        icon: providerIcons[adAccount.provider],
        label: adAccount.name,
      }));
    if (isEmpty(adAccountsList)) {
      throw new Error('AdAccount List is empty');
    }
    return adAccountsList;
  }

  @Selector()
  public static isSubscriptionActive(state: WorkspaceStateModel): boolean {
    if (isNil(state.workspace) || isUndefined(state.workspace.owner)) {
      return true;
    }
    return state.workspace.owner?.subscriptionStatus ? true : false;
  }

  @Selector()
  static adAccountsFormList(state) {
    const adAccountsList = state.workspace.adAccounts;
    const adNetworks = [
      {
        value: 'facebook',
        name: 'Facebook',
        icon: providerIcons.facebook,
        targetFormControlName: 'facebookTarget',
        adAccountFormControlName: 'facebookAdAccount',
        adAccounts: [] as AdAccountDTO[],
        active: true,
      },
      {
        value: 'linkedin',
        name: 'LinkedIn',
        icon: providerIcons.linkedin,
        targetFormControlName: 'linkedinTarget',
        adAccountFormControlName: 'linkedinAdAccount',
        adAccounts: [] as AdAccountDTO[],
        active: environment.features.linkedin,
      },
    ];
    return adNetworks
      .filter((network) => network.active)
      .map((network) => {
        const adAccounts = adAccountsList.filter(({ provider }) => provider === network.value);
        return { ...network, adAccounts };
      });
  }

  @Action(SyncWorkspace)
  public syncWorkspace({ getState }: StateContext<WorkspaceStateModel>) {
    return this.workspaceApiService.syncWorkspaceData({ workspaceId: getState().workspace.id }).pipe(
      tap((response: any) => {
        this.displayNotification.displayNotification(
          new Notification({
            titleId: response.jsonKey,
            type: NotificationType.SUCCESS,
          }),
        );
      }),
      catchError((err: HttpErrorResponse) => {
        this.displayNotification.displayNotification(
          new Notification({
            content: err.message,
            type: NotificationType.ERROR,
          }),
        );
        return throwError(new Error(err.message));
      }),
    );
  }

  @Action(SwitchWorkspace)
  public switchWorkspace(
    { patchState, dispatch }: StateContext<WorkspaceStateModel>,
    { selectedWorkspace }: SwitchWorkspace,
  ): Observable<any> {
    return this.userApiService.updateMe({ payload: { settings: { defaultWorkspace: selectedWorkspace.id } } }).pipe(
      tap((user: any) => {
        const { assignedWorkspaces } = user;
        const defaultWorkspace =
          assignedWorkspaces.find((workspace) => workspace.id === user.settings?.defaultWorkspace) ??
          assignedWorkspaces[0];
        this.setUser.emit(user);
        patchState({ workspace: defaultWorkspace });
        dispatch(new InitializeDashboard());
      }),
    );
  }
}
