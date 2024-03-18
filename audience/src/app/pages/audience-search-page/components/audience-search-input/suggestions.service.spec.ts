import { TestBed } from '@angular/core/testing';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { of, throwError } from 'rxjs';
import { SuggestionsService } from './suggestions.service';

describe('Suggestion service', () => {
  let suggestionsService: SuggestionsService;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestionsService,
        {
          provide: AudienceApiService,
          useValue: {
            fetchAutoCompleteSuggestions: (dev: string) => {
              if (dev) {
                return of([{ name: 'dev' }, { name: 'andy' }, { name: 'etc' }]);
              }
              return throwError('some error');
            },
            fetchAIKeywordsSuggestions: () => of(null),
          },
        },
        {
          provide: LoadingService,
          useValue: {
            isLoadingKeywordsSuggestions: { emit: () => {} },
          },
        },
        {
          provide: DisplayNotificationService,
          useValue: {
            displayNotification: (notification) => {},
          },
        },
      ],
    });

    suggestionsService = TestBed.inject(SuggestionsService);
    loadingService = TestBed.inject(LoadingService);
  });

  it('should be defined', () => {
    expect(suggestionsService).toBeDefined();
  });

  it('should clear suggestions', () => {
    suggestionsService.suggestions$.next(['something', 'test']);
    suggestionsService.clearSuggestions();
    expect(suggestionsService.suggestions$.value).toEqual([]);
  });

  describe('should fetch suggestions', () => {
    it('should set suggestions', (done) => {
      suggestionsService.fetchAutoCompleteSuggestions(['dev']).subscribe((result) => {
        expect(suggestionsService.suggestions$.value).toEqual(['dev', 'andy', 'etc']);
        done();
      });
    });
  });

  describe('fetchAIKeywordsSuggestions', () => {
    it('should return empty array obs ', (done) => {
      const result = suggestionsService.fetchAIKeywordsSuggestions([]);
      result.subscribe((suggestions) => {
        expect(suggestions).toEqual([]);
        done();
      });
    });
    it('should return empty array obs ', (done) => {
      const result = suggestionsService.fetchAIKeywordsSuggestions([]);
      result.subscribe((suggestions) => {
        expect(suggestions).toEqual([]);
        done();
      });
    });
    it('should call next on keywordsSuggestions$ with empty array', () => {
      const spy = jest.spyOn(suggestionsService.keywordsSuggestions$, 'next');
      suggestionsService.fetchAIKeywordsSuggestions([]);
      expect(spy).toBeCalledWith([]);
    });

    it('should emit isLoadingKeywordsSuggestions true', () => {
      const spy = jest.spyOn((suggestionsService as any).loadingService.isLoadingKeywordsSuggestions, 'emit');
      suggestionsService.fetchAIKeywordsSuggestions([], ['test']);
      expect(spy).toBeCalledWith(true);
    });

    it('should call audienceApiService.fetchAIKeywordsSuggestions with argument', () => {
      const spy = jest.spyOn((suggestionsService as any).audienceApiService, 'fetchAIKeywordsSuggestions');
      suggestionsService.fetchAIKeywordsSuggestions([{ id: 'test id' }] as any, ['test keyword']);
      expect(spy).toBeCalledWith(['test id'], ['test keyword']);
    });

    it('should call next on keywordsSuggestions$ with return from audienceApiService.fetchAIKeywordsSuggestions', (done) => {
      const mockKeywordsSuggestions = ['test 1', 'test 2'];
      jest
        .spyOn((suggestionsService as any).audienceApiService, 'fetchAIKeywordsSuggestions')
        .mockReturnValue(of(mockKeywordsSuggestions));
      const keywordsSuggestionsSpy = jest.spyOn(suggestionsService.keywordsSuggestions$, 'next');
      suggestionsService.fetchAIKeywordsSuggestions([], ['test']).subscribe(() => {
        expect(keywordsSuggestionsSpy).toBeCalledWith(mockKeywordsSuggestions);
        done();
      });
    });
  });

  describe('fetchAutoCompleteSuggestions', () => {
    it('should call next with true on isLoadingSuggestions$', () => {
      const spy = jest.spyOn(suggestionsService.isLoadingSuggestions$, 'next');
      suggestionsService.fetchAutoCompleteSuggestions([]);
      expect(spy).toBeCalledWith(true);
    });
  });
});
