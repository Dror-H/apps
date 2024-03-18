import { Injectable } from '@angular/core';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Selector, State, StateContext } from '@ngxs/store';

export interface OnboardingStateModel {
  step: number;
  workspace: string;
  invitedMembers: string[];
  selectedAdAccounts: AdAccountDTO[];
}

@State<OnboardingStateModel>({
  name: 'onboarding',
  defaults: {
    step: 1,
    workspace: null,
    invitedMembers: [],
    selectedAdAccounts: [],
  },
})
@Injectable()
export class OnboardingState {
  @Receiver()
  public static set(
    { setState }: StateContext<any>,
    { payload: { step, workspace, invitedMembers, selectedAdAccounts } }: EmitterAction<Partial<OnboardingStateModel>>,
  ) {
    setState({ step, workspace, invitedMembers, selectedAdAccounts });
  }

  @Receiver()
  public static update(
    { patchState }: StateContext<OnboardingState>,
    { payload }: EmitterAction<Partial<OnboardingStateModel>>,
  ) {
    patchState(payload);
  }

  @Selector()
  public static get(state: OnboardingStateModel): OnboardingStateModel {
    return state;
  }

  @Selector()
  public static getSelectedAccounts(state: OnboardingStateModel): AdAccountDTO[] {
    return state.selectedAdAccounts;
  }

  @Selector()
  public static step(state: OnboardingStateModel): number {
    return state.step || 1;
  }
}
