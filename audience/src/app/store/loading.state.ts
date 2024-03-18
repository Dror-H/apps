import { Injectable } from '@angular/core';
import { Loading } from '@instigo-app/data-transfer-object';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Selector, State, StateContext } from '@ngxs/store';

export interface LoadingStateModel {
  audiences: boolean;
  mergedAudience: boolean;
  static: boolean;
  savingAudience: boolean;
  keywordsSuggestions: boolean;
  loading: boolean;
  auth: boolean;
}

@State<LoadingStateModel>({
  name: 'loading',
  defaults: {
    loading: false,
    audiences: false,
    mergedAudience: false,
    static: false,
    savingAudience: false,
    keywordsSuggestions: false,
    auth: false,
  },
})
@Injectable()
export class LoadingState {
  @Selector()
  public static getLoading(state: LoadingStateModel): boolean {
    return state.loading;
  }

  @Selector()
  public static getIsLoadingAuth(state: LoadingStateModel): boolean {
    return state.auth;
  }

  @Selector()
  public static getIsLoadingAudiences(state: LoadingStateModel): boolean {
    return state.audiences;
  }

  @Selector()
  public static getIsLoadingMergedAudience(state: LoadingStateModel): boolean {
    return state.mergedAudience;
  }

  @Selector()
  public static getIsLoadingStatic(state: LoadingStateModel): boolean {
    return state.static;
  }

  @Selector()
  public static getIsSavingAudience(state: LoadingStateModel): boolean {
    return state.savingAudience;
  }

  @Selector()
  public static getIsLoadingKeywordsSuggestions(state: LoadingStateModel): boolean {
    return state.keywordsSuggestions;
  }

  @Receiver(Loading)
  public static setLoading(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<{ loading: boolean }>,
  ): void {
    patchState({ loading: payload.loading });
  }

  @Receiver()
  public static setIsLoadingAuth(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<boolean>,
  ): void {
    patchState({ auth: payload });
  }

  @Receiver()
  public static setIsLoadingAudiences(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<boolean>,
  ): void {
    patchState({ audiences: payload });
  }

  @Receiver()
  public static setIsLoadingMergedAudience(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<boolean>,
  ): void {
    patchState({ mergedAudience: payload });
  }

  @Receiver()
  public static setIsLoadingStatic(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<boolean>,
  ): void {
    patchState({ static: payload });
  }

  @Receiver()
  public static setIsSavingAudience(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<boolean>,
  ): void {
    patchState({ savingAudience: payload });
  }

  @Receiver()
  public static setIsLoadingKeywordsSuggestions(
    { patchState }: StateContext<LoadingStateModel>,
    { payload }: EmitterAction<boolean>,
  ): void {
    patchState({ keywordsSuggestions: payload });
  }
}
