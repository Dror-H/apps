import { SearchResult } from '@instigo-app/data-transfer-object';
import { Injectable } from '@angular/core';
import { getSanitizedSearchHistory } from '@audience-app/store/audiences-state.utils';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Selector, State, StateContext } from '@ngxs/store';
import { uniqBy } from 'lodash';

export interface AudiencesStateModel {
  foundAudiences: SearchResult[];
  noFoundAudiencesCount: number;
  selectedAudiences: SearchResult[];
  searchHistory: string[];
}

export const DEFAULT_AUDIENCES_STATE: AudiencesStateModel = {
  foundAudiences: [],
  noFoundAudiencesCount: 0,
  searchHistory: [],
  selectedAudiences: [],
};

@State<AudiencesStateModel>({
  name: 'audiences',
  defaults: DEFAULT_AUDIENCES_STATE,
})
@Injectable()
export class AudiencesState {
  @Selector()
  public static getFoundAudiences(state: AudiencesStateModel): SearchResult[] {
    return state.foundAudiences;
  }

  @Selector()
  public static getSearchHistory(state: AudiencesStateModel): string[] {
    return [...state.searchHistory];
  }

  @Selector()
  public static getSelectedAudiences(state: AudiencesStateModel): SearchResult[] {
    return state.selectedAudiences;
  }

  @Selector()
  public static getNoFoundAudiencesCount(state: AudiencesStateModel): number {
    return state.noFoundAudiencesCount;
  }

  @Receiver()
  public static setFoundAudiences(
    { patchState, getState }: StateContext<AudiencesStateModel>,
    { payload }: EmitterAction<SearchResult[]>,
  ): void {
    patchState({ foundAudiences: payload, noFoundAudiencesCount: getNoFoundAudiencesCount(getState()) });
  }

  @Receiver()
  public static setSelectedAudiences(
    { patchState }: StateContext<AudiencesStateModel>,
    { payload }: EmitterAction<SearchResult[]>,
  ): void {
    patchState({ selectedAudiences: payload });
  }

  @Receiver()
  public static toggleSelectAudience(
    { patchState, getState }: StateContext<AudiencesStateModel>,
    { payload: selectedAudience }: EmitterAction<SearchResult>,
  ): void {
    let selectedAudiences = [...getState().selectedAudiences];
    const isAudienceSelected = selectedAudiences.find((audience) => audience.id === selectedAudience.id);
    if (isAudienceSelected) {
      selectedAudiences = selectedAudiences.filter((audience) => audience.id !== selectedAudience.id);
    } else {
      selectedAudiences = [...selectedAudiences, selectedAudience];
    }
    patchState({ selectedAudiences });
  }

  @Receiver()
  public static setSearchHistory(
    { patchState, getState }: StateContext<AudiencesStateModel>,
    { payload }: EmitterAction<string[]>,
  ): void {
    const searchHistoryCopy = [...getState().searchHistory];
    const updatedHistory = getSanitizedSearchHistory([...searchHistoryCopy, ...payload]);
    patchState({ searchHistory: updatedHistory });
  }

  @Receiver()
  public static addSearchHistoryValue(
    { patchState, getState }: StateContext<AudiencesStateModel>,
    { payload }: EmitterAction<string>,
  ): void {
    const currentHistory = [...getState().searchHistory];
    const updatedHistory = getSanitizedSearchHistory([...currentHistory, payload]);
    patchState({ searchHistory: updatedHistory });
  }

  @Receiver()
  public static removeSearchHistoryValue(
    { getState, patchState }: StateContext<AudiencesStateModel>,
    { payload }: EmitterAction<string>,
  ): void {
    const { searchHistory } = getState();
    const updatedHistory = searchHistory.filter((v) => v !== payload);
    patchState({ searchHistory: updatedHistory });
  }

  @Receiver()
  public static addFoundAudiences(
    { getState, patchState }: StateContext<AudiencesStateModel>,
    { payload }: EmitterAction<SearchResult[]>,
  ): void {
    const uniqueAudiences = uniqBy([...getState().foundAudiences, ...payload], 'id');
    const audiences = uniqueAudiences.sort((a, b) => b.rank - a.rank);
    patchState({ foundAudiences: audiences });
  }
}

function getNoFoundAudiencesCount(state: AudiencesStateModel): number {
  const { noFoundAudiencesCount, foundAudiences } = state;
  let noFoundAudiencesCountUpdate = 0;
  if (Array.isArray(foundAudiences) && foundAudiences.length === 0) {
    noFoundAudiencesCountUpdate = noFoundAudiencesCount + 1;
  }
  return noFoundAudiencesCountUpdate;
}
