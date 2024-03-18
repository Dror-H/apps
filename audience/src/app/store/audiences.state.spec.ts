import { TestBed } from '@angular/core/testing';
import {
  addFoundAudiencesSearchResults1,
  addFoundAudiencesSearchResults2,
  addFoundAudiencesSortedResult,
} from '@audience-app/global/test-data/addFoundAudiences.mocks';
import {
  mockSearchResults,
  regularSearchResult,
  selectTagsSearchResult,
} from '@audience-app/pages/audience-edit-page/mocks';
import { getSanitizedSearchHistory } from '@audience-app/store/audiences-state.utils';
import { AudiencesState, AudiencesStateModel, DEFAULT_AUDIENCES_STATE } from '@audience-app/store/audiences.state';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { EmitterService } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';

describe('AudienceState', () => {
  let store: Store;
  let emitter: EmitterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestBedModule.configureTestingModule([AudiencesState])],
    });

    store = TestBed.inject(Store);
    emitter = TestBed.inject(EmitterService);
  });

  describe('audiences', () => {
    describe('selectors', () => {
      it('should get found audiences', () => {
        const state: AudiencesStateModel = { ...DEFAULT_AUDIENCES_STATE, foundAudiences: mockSearchResults };
        const foundAudiences = AudiencesState.getFoundAudiences(state);
        expect(foundAudiences).toEqual(mockSearchResults);
      });

      it('should get selected audiences', () => {
        const state: AudiencesStateModel = { ...DEFAULT_AUDIENCES_STATE, selectedAudiences: mockSearchResults };
        const selectedAudiences = AudiencesState.getSelectedAudiences(state);
        expect(selectedAudiences).toEqual(mockSearchResults);
      });

      it('should get selected audiences', () => {
        const expectedSearchHistory = ['test 1', 'test 2', 'test 3'];
        const state: AudiencesStateModel = { ...DEFAULT_AUDIENCES_STATE, searchHistory: expectedSearchHistory };
        const searchHistory = AudiencesState.getSearchHistory(state);
        expect(searchHistory).toEqual(expectedSearchHistory);
      });
    });

    describe('receivers', () => {
      it('should set found audiences', () => {
        emitter.action<SearchResult[]>(AudiencesState.setFoundAudiences).emit(mockSearchResults);
        const foundAudiences = store.selectSnapshot<string[]>((state) => state.audiences.foundAudiences);
        expect(foundAudiences).toEqual(mockSearchResults);
      });

      it('should set selected audiences', () => {
        emitter.action<SearchResult[]>(AudiencesState.setSelectedAudiences).emit(mockSearchResults);
        const selectedAudiences = store.selectSnapshot<string[]>((state) => state.audiences.selectedAudiences);
        expect(selectedAudiences).toEqual(mockSearchResults);
      });

      it('should add audiences to selected audiences', () => {
        emitter.action<SearchResult>(AudiencesState.toggleSelectAudience).emit(mockSearchResults[0]);
        emitter.action<SearchResult>(AudiencesState.toggleSelectAudience).emit(mockSearchResults[1]);
        const selectedAudience = store.selectSnapshot<string[]>((state) => state.audiences.selectedAudiences);
        expect(selectedAudience).toEqual([mockSearchResults[0], mockSearchResults[1]]);
      });

      it('should remove audience with same id', () => {
        emitter
          .action<SearchResult>(AudiencesState.toggleSelectAudience)
          .emitMany([mockSearchResults[0], mockSearchResults[1], mockSearchResults[2], mockSearchResults[1]]);
        const selectedAudience = store.selectSnapshot<string[]>((state) => state.audiences.selectedAudiences);
        expect(selectedAudience).toEqual([mockSearchResults[0], mockSearchResults[2]]);
      });
    });
  });

  describe('searchHistory', () => {
    describe('addSearchHistoryValue', () => {
      it('should push one history item', () => {
        emitter.action<string>(AudiencesState.addSearchHistoryValue).emit('Developer');
        const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
        expect(searchHistory).toEqual(['Developer']);
      });

      it('should not have duplicates in search history', () => {
        emitter.action<string>(AudiencesState.addSearchHistoryValue).emit('Developer');
        emitter.action<string>(AudiencesState.addSearchHistoryValue).emit('Developer');
        const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
        expect(searchHistory).toEqual(['Developer']);
      });

      it('should remove value from search history', () => {
        emitter.action<string>(AudiencesState.addSearchHistoryValue).emitMany(['Developer', 'Marketing']);
        emitter.action<string>(AudiencesState.removeSearchHistoryValue).emit('Developer');
        const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
        expect(searchHistory).toEqual(['Marketing']);
      });

      it('should have max num (5) tags in search history', () => {
        const mockSearchValues = ['Developer', 'Marketing', 'IT', 'Croatia', 'Malta', 'Java', 'Backend'];
        const expectedResult2 = ['IT', 'Croatia', 'Malta', 'Java', 'Backend'];

        emitter.action<string>(AudiencesState.addSearchHistoryValue).emitMany(mockSearchValues);

        const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
        expect(searchHistory).toEqual(expectedResult2);
      });
    });
  });

  describe('setSearchHistory', () => {
    it('should set history adding payload values', () => {
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit(['Developer', 'Marketing']);
      const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
      expect(searchHistory).toEqual(['Developer', 'Marketing']);
    });

    it('should set history adding payload values keeping last duplicates case insensitive', () => {
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit(['Developer', 'Marketing']);
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit(['developer', 'MARKETING']);
      const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
      expect(searchHistory).toEqual(['developer', 'MARKETING']);
    });

    it('should set history adding payload values keeping last duplicates case insensitive', () => {
      const mockInitSearchHistory = ['Developer', 'Marketing', 'test-1', 'test-2', 'test-3'];
      const mockValuesToEmit = ['developer', 'MARKETING'];
      const expectedSearchHistory = ['test-1', 'test-2', 'test-3', ...mockValuesToEmit];
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit(mockInitSearchHistory);
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit(mockValuesToEmit);
      const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
      expect(searchHistory).toEqual(expectedSearchHistory);
    });

    it('should not modify history on empty array', () => {
      const mockInitSearchHistory = ['Developer', 'Marketing', 'test-1', 'test-2', 'test-3'];
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit(mockInitSearchHistory);
      emitter.action<string[]>(AudiencesState.setSearchHistory).emit([]);
      const searchHistory = store.selectSnapshot<string[]>((state) => state.audiences.searchHistory);
      expect(searchHistory).toEqual(mockInitSearchHistory);
    });
  });

  describe('addFoundAudiences', () => {
    it('should add found audiences sorted by rank', () => {
      emitter.action<SearchResult[]>(AudiencesState.setFoundAudiences).emit(addFoundAudiencesSearchResults1);
      emitter.action<SearchResult[]>(AudiencesState.addFoundAudiences).emit(addFoundAudiencesSearchResults2);
      const result = store.selectSnapshot(AudiencesState.getFoundAudiences);
      expect(result).toEqual(addFoundAudiencesSortedResult);
    });

    it('should add found audiences filtered by id', () => {
      emitter.action<SearchResult[]>(AudiencesState.setFoundAudiences).emit([regularSearchResult]);
      emitter.action<SearchResult[]>(AudiencesState.addFoundAudiences).emit([regularSearchResult]);
      emitter.action<SearchResult[]>(AudiencesState.addFoundAudiences).emit([selectTagsSearchResult]);
      const result = store.selectSnapshot(AudiencesState.getFoundAudiences);
      expect(result.length).toBe(2);
    });
  });

  describe('utils', () => {
    describe('getSanitizedSearchHistory', () => {
      it('should return as many last values as number provided in maxValues argument', () => {
        const mockSearchHistory = ['1', '2', '3', '4', '5', '6', '7'];
        const expectedResult = ['5', '6', '7'];
        const result = getSanitizedSearchHistory(mockSearchHistory, 3);
        expect(result).toEqual(expectedResult);
      });

      it('should return empty array', () => {
        const result = getSanitizedSearchHistory([]);
        expect(result).toEqual([]);
      });
    });
  });
});
