import { Injectable } from '@angular/core';
import { providerIcons } from '@app/global/constants';
import { AdAccountDTO, DateTimeInterval } from '@instigo-app/data-transfer-object';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { endOfDay, subDays } from 'date-fns';
import { isEmpty } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { WorkspaceState } from '../state/workspace.state';

export class InitializeDashboard {
  static readonly type = '[DASHBOARD] INITIALIZE';
}

export interface SessionStateModel {
  selectedAdAccount: AdAccountDTO;
  selectedTimeInterval: DateTimeInterval;
  isInitialized: boolean;
}

@State<SessionStateModel>({
  name: 'dashboard',
  defaults: {
    selectedAdAccount: null,
    selectedTimeInterval: {
      dateRange: { start: subDays(new Date(), 30), end: endOfDay(new Date().getTime()) },
    },
    isInitialized: false,
  },
})
@Injectable()
export class SessionState {
  constructor(private store: Store) {}

  @Receiver()
  public static update(
    { patchState }: StateContext<SessionStateModel>,
    { payload }: EmitterAction<Partial<SessionStateModel>>,
  ): void {
    patchState(payload);
  }

  @Selector([SessionState])
  public static get(state: SessionStateModel): SessionStateModel {
    return state;
  }

  @Receiver()
  public static setDateTimeInterval(
    { patchState }: StateContext<SessionStateModel>,
    { payload }: EmitterAction<DateTimeInterval>,
  ): void {
    patchState({ selectedTimeInterval: payload });
  }

  @Selector()
  public static selectedTimeInterval(state: SessionStateModel): DateTimeInterval {
    return state.selectedTimeInterval;
  }

  @Selector([SessionState])
  public static isInitialized(state: SessionStateModel): boolean {
    return state.isInitialized;
  }

  @Selector([SessionState])
  public static selectedAdAccount(state: SessionStateModel): any {
    return state.selectedAdAccount;
  }

  @Action(InitializeDashboard)
  initializeApp({ patchState, getState }: StateContext<SessionStateModel>): Observable<unknown> {
    try {
      patchState({ isInitialized: false });
      const workspace = this.store.selectSnapshot(WorkspaceState.get);
      const { adAccounts } = workspace;
      const adAccountsList = adAccounts.map((adAccount) => ({
        ...adAccount,
        icon: providerIcons[adAccount.provider],
        label: adAccount.name,
      }));
      if (isEmpty(adAccountsList)) {
        throw new Error('AdAccount List is empty');
      }
      const state = getState();
      patchState({
        selectedAdAccount: this.retrieveSelectedAdAccount(adAccountsList, state.selectedAdAccount),
        isInitialized: true,
      });
    } catch (err) {
      return of();
    }
  }

  private retrieveSelectedAdAccount(
    newAdAccountList: AdAccountDTO[],
    currentSelectedAdAccount: AdAccountDTO,
  ): AdAccountDTO {
    const selectedAdAccount = newAdAccountList.find((adAccount: any) => adAccount.id === currentSelectedAdAccount?.id);
    return selectedAdAccount ? selectedAdAccount : newAdAccountList[0];
  }
}
