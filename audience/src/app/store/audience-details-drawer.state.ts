import { Injectable } from '@angular/core';
import { TargetingConditionDto, TargetingTypesPercentages } from '@instigo-app/data-transfer-object';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Selector, State, StateContext } from '@ngxs/store';

export interface AudienceDetailsDrawerStateModel {
  isVisible: boolean;
  data: AudienceDetailsDrawerData;
}

export interface AudienceDetailsDrawerData {
  inclusions: TargetingConditionDto[][];
  exclusions: TargetingConditionDto[];
  userTags: string[];
  specRatio: Partial<TargetingTypesPercentages>;
  rank: number;
}

@State<AudienceDetailsDrawerStateModel>({
  name: 'audienceDetailsDrawer',
  defaults: {
    isVisible: false,
    data: null,
  },
})
@Injectable()
export class AudienceDetailsDrawerState {
  @Receiver()
  public static set(
    { setState }: StateContext<AudienceDetailsDrawerStateModel>,
    { payload }: EmitterAction<AudienceDetailsDrawerStateModel>,
  ): void {
    setState({ isVisible: payload.isVisible, data: payload.data });
  }

  @Selector()
  public static get(state: AudienceDetailsDrawerStateModel): AudienceDetailsDrawerStateModel {
    return state;
  }
}
