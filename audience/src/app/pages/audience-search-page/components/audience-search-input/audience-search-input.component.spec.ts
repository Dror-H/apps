/* eslint-disable max-lines */
/* eslint-disable max-statements */
import { Component, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { HistoryService } from '@audience-app/pages/audience-search-page/components/audience-search-input/history.service';
import { SuggestionsService } from '@audience-app/pages/audience-search-page/components/audience-search-input/suggestions.service';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { AudienceSearchInputComponent } from './audience-search-input.component';

@Pipe({ name: 'ellipsis' })
export class MockEllipsisPipe implements PipeTransform {
  transform(text: string, maxLength = 20): string {
    return text;
  }
}

@Component({
  selector: 'audi-keywords-suggestions',
  template: `<div></div>`,
})
export class MockKeywordsSuggestionsComponent {
  @Input() public keywordsSuggestions: string[] = [];
  @Input() public isLoading = false;
  @Output() public suggestionSelected = new EventEmitter<string>();
  @Output() public refreshSuggestions = new EventEmitter<undefined>();
}

@Component({
  selector: 'ingo-loading-messages',
  template: `<div></div>`,
})
export class MockLoadingMessagesComponent {
  @Input() public messages: string[] = [];
  @Input() public stop: boolean;
  @Input() public msBetweenMessages = 2500;
}

const routes: Routes = [
  {
    path: '',
    component: AudienceSearchInputComponent,
  },
];

describe('AudienceSearchInputComponent', () => {
  let component: AudienceSearchInputComponent;
  let fixture: ComponentFixture<AudienceSearchInputComponent>;
  let historyService: HistoryService;
  let suggestionsService: SuggestionsService;
  let router: Router;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AudienceSearchInputComponent,
        MockEllipsisPipe,
        MockKeywordsSuggestionsComponent,
        MockLoadingMessagesComponent,
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        RouterTestingModule.withRoutes(routes),
        StoreTestBedModule.configureTestingModule([AudiencesState]),
        NzGridModule,
        NzSpinModule,
        NzTagModule,
        NzIconModule,
        NzSelectModule,
        NzButtonModule,
        NzTypographyModule,
      ],
      providers: [
        {
          provide: SuggestionsService,
          useValue: {
            suggestions: new BehaviorSubject(['tags', 'something']),
            isLoadingSuggestions$: new BehaviorSubject(false),
            clearSuggestions: () => {},
            fetchAutoCompleteSuggestions: (searchTerm: string) => of(['suggestion1', 'sugg2']),
            fetchAIKeywordsSuggestions: () => of(['test']),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            selectedKeywords: [],
            searchHistory$: new BehaviorSubject<string[]>(['andy', 'dev', 'etc']),
            handleParamsKeywords: () => {},
            removeSearchHistoryValue: (value, ev) => {},
            subscribeToSearchHistory: () => new Subscription(),
            getAudiences: () => of(null),
            removeAllSelectedKeywords: jest.fn(),
            updateSearchHistory: () => {},
          },
        },
        {
          provide: DisplayNotificationService,
          useValue: {
            displayTemplateNotification: () => ({ messageId: '1' }),
            removeNotification: () => {},
            removePreviousNotificationIfSame: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceSearchInputComponent);
    historyService = TestBed.inject(HistoryService);
    suggestionsService = TestBed.inject(SuggestionsService);
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    store.reset(AudiencesState);
    component = fixture.componentInstance;
    component.selectedKeywords = [];
    router.initialNavigation();
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnDestroy', () => {
    it('should call resetHistorySelectedKeywords', () => {
      const resetHistorySelectedKeywordsSpy = jest.spyOn(component as any, 'resetHistorySelectedKeywords');
      const unsubscribeSpy = jest.spyOn((component as any).subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(resetHistorySelectedKeywordsSpy).toBeCalled();
      expect(unsubscribeSpy).toBeCalled();
    });
  });

  describe('handleParamsOnInit', () => {
    it('should call historyService.handleParamsKeywords', () => {
      const spy = jest.spyOn(historyService, 'handleParamsKeywords');
      (component as any).handleParamsOnInit();
      expect(spy).toBeCalled();
    });

    it('should set selected keywords to history selectedKeywords after params handling', () => {
      jest.spyOn(historyService, 'handleParamsKeywords').mockImplementation(() => {});
      historyService.selectedKeywords = ['test 1', 'test 2'];
      (component as any).handleParamsOnInit();
      expect(component.selectedKeywords).toEqual(['test 1', 'test 2']);
    });
    it('should call historyService.getAudiences with selectedKeywords', () => {
      jest.spyOn(historyService, 'handleParamsKeywords').mockImplementation(() => {});
      const spy = jest.spyOn(historyService, 'getAudiences');
      historyService.selectedKeywords = ['test 1', 'test 2'];
      (component as any).handleParamsOnInit();
      expect(spy).toBeCalledWith(['test 1', 'test 2']);
    });

    it('should call fetchAIKeywordsSuggestions$ with selectedKeywords', () => {
      jest.spyOn(historyService, 'getAudiences').mockReturnValue(of(['test'] as any));
      const spy = jest.spyOn(component, 'fetchAIKeywordsSuggestions$');
      (component as any).handleParamsOnInit();
      expect(spy).toBeCalledWith(['test']);
    });
  });

  describe('onSelectedKeywordSuggestion', () => {
    it('should call on submit with current selected keywords and newly selected keyword', () => {
      const spy = jest.spyOn(component, 'onSubmit');
      component.selectedKeywords = ['test 1', 'test 2'];
      component.onSelectedKeywordSuggestion('test 3');
      expect(spy).toBeCalledWith(['test 1', 'test 2', 'test 3']);
    });

    it('should call onSearch with empty string', () => {
      const spy = jest.spyOn(component, 'onSearch');
      component.onSubmit(['test']);
      expect(spy).toBeCalledWith('');
    });
  });

  describe('onSearch', () => {
    let spy: jest.SpyInstance<unknown, unknown[]>;

    beforeEach(() => {
      spy = jest.spyOn((component as any).search$, 'next');
      jest.clearAllMocks();
    });

    it('should return early', () => {
      component.selectedKeywords = [];
      component.onSearch('');
      expect(spy).not.toBeCalled();
      expect(component.searchValue).toBe('');
    });

    it('should update searchValue', () => {
      const mockSearchValue = 'test';
      component.onSearch(mockSearchValue);
      expect(component.searchValue).toBe(mockSearchValue);
    });

    it('should call next on search$ with selected keywords and search value', () => {
      const testSearchValue = 'test search value';
      component.selectedKeywords = ['test key 1', 'test key 2'];
      component.onSearch(testSearchValue);
      expect(spy).toBeCalledWith(['test key 1', 'test key 2', testSearchValue]);
    });
  });

  describe('onSubmit', () => {
    it('should call next on submit$ with input', () => {
      const spy = jest.spyOn((component as any).submit$, 'next');
      component.onSubmit(['test']);
      expect(spy).toBeCalledWith(['test']);
    });

    it('should call onSearch with empty string', () => {
      const spy = jest.spyOn(component, 'onSearch');
      component.onSubmit(['test']);
      expect(spy).toBeCalledWith('');
    });
  });

  describe('isSelected', () => {
    it('should return false', () => {
      expect(component.isSelected('test 2')).toBe(false);
    });

    it('should return false', () => {
      component.selectedKeywords = ['test 1'];
      expect(component.isSelected('test 2')).toBe(false);
    });
    it('should return true', () => {
      component.selectedKeywords = ['test'];
      expect(component.isSelected('test')).toBe(true);
    });
  });

  describe('removeSearchHistoryValue', () => {
    it('should call stop propagation on ev', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const mockEv = { stopPropagation: (): void => {} };
      const spy = jest.spyOn(mockEv, 'stopPropagation');
      component.removeSearchHistoryValue('', mockEv as any);
      expect(spy).toBeCalled();
    });

    it('should call historyService.removeSearchHistoryValue with value', () => {
      const spy = jest.spyOn(historyService, 'removeSearchHistoryValue');
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      component.removeSearchHistoryValue('dev', { stopPropagation: () => {} } as any);
      expect(spy).toBeCalledWith('dev');
    });
  });

  describe('refreshAIKeywordsSuggestions', () => {
    it('should call fetchAIKeywordsSuggestions$ with found audiences', () => {
      store.reset({ audiences: { foundAudiences: ['test audience 1'] } });
      const spy = jest.spyOn(component, 'fetchAIKeywordsSuggestions$');
      component.refreshAIKeywordsSuggestions();
      expect(spy).toBeCalledWith(['test audience 1']);
    });

    it('should call subscribe on fetchAIKeywordsSuggestions$', () => {
      const mockSub = { subscribe: jest.fn() };
      jest.spyOn(component, 'fetchAIKeywordsSuggestions$').mockReturnValue(mockSub as any);
      component.refreshAIKeywordsSuggestions();
      expect(mockSub.subscribe).toBeCalled();
    });
  });

  describe('fetchAIKeywordsSuggestions', () => {
    it('should call this.suggestionsService.fetchAIKeywordsSuggestions with audiences from input and this.historyService.selectedKeywords', () => {
      const spy = jest.spyOn(suggestionsService, 'fetchAIKeywordsSuggestions');
      historyService.selectedKeywords = ['test sel'];
      component.fetchAIKeywordsSuggestions$(['test aud'] as any);
      expect(spy).toBeCalledWith(['test aud'], ['test sel']);
    });
  });

  describe('handleSubmitEventBeforeApiCalls', () => {
    it('should call closeDropdown', () => {
      const spy = jest.spyOn(component as any, 'closeDropdown');
      (component as any).handleSubmitEventBeforeApiCalls([]);
      expect(spy).toBeCalled();
    });
    it('should set selectedKeywords with input', () => {
      (component as any).handleSubmitEventBeforeApiCalls(['test']);
      expect(component.selectedKeywords).toEqual(['test']);
    });

    it('should call this.historyService.updateSearchHistory with selectedKeywords on component', () => {
      const spy = jest.spyOn(historyService, 'updateSearchHistory');
      (component as any).handleSubmitEventBeforeApiCalls(['test 1', 'test 2']);
      expect(spy).toBeCalledWith(['test 1', 'test 2']);
    });

    it('should call suggestionsService.clearSuggestions', () => {
      const spy = jest.spyOn(suggestionsService, 'clearSuggestions');
      (component as any).handleSubmitEventBeforeApiCalls([]);
      expect(spy).toBeCalled();
    });
  });

  describe('navigateToCurrentWithKeywordsParams', () => {
    it('should route to / with keywords', (done) => {
      component.selectedKeywords = ['dev', 'marketing'];
      const sub = router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          expect(event.url).toEqual('/?keywords=dev&keywords=marketing');
          done();
          sub.unsubscribe();
        }
      });
      (component as any).navigateToCurrentWithKeywordsParams();
    });
  });

  describe('resetHistorySelectedKeywords', () => {
    it('should call historyService.removeAllSelectedKeywords', () => {
      const spy = jest.spyOn(historyService, 'removeAllSelectedKeywords');
      (component as any).resetHistorySelectedKeywords();
      expect(spy).toBeCalled();
    });
  });

  describe('closeDropdown', () => {
    it('should close the dropdown', () => {
      component.nzSelect.nzOpen = true;
      component.onSubmit(['dev', 'marketing']);
      expect(component.nzSelect.nzOpen).toBeFalsy();
    });
  });

  describe('handleSubmitEvent', () => {
    const DEBOUNCE_TIME = 300;
    it('should call handleSubmitEventBeforeApiCalls with emitted keywords', () => {
      const spy = jest.spyOn(component as any, 'handleSubmitEventBeforeApiCalls');
      component.onSubmit(['test 1', 'test 2']);
      expect(spy).toBeCalledWith(['test 1', 'test 2']);
    });

    it('should call getAudiences with component selected keywords', fakeAsync(() => {
      const spy = jest.spyOn(historyService, 'getAudiences');
      component.onSubmit(['test 1', 'test 2']);
      tick(DEBOUNCE_TIME);
      expect(spy).toBeCalledWith(['test 1', 'test 2']);
    }));

    it('should call fetchAIKeywordsSuggestions$ with returned audiences from getAudiences', fakeAsync(() => {
      jest.spyOn(historyService, 'getAudiences').mockReturnValue(of(['test aud 1', 'test aud 2'] as any));
      const spy = jest.spyOn(component, 'fetchAIKeywordsSuggestions$');
      component.onSubmit([]);
      tick(DEBOUNCE_TIME);
      expect(spy).toBeCalledWith(['test aud 1', 'test aud 2']);
    }));

    it('should call navigateToCurrentWithKeywordsParams on success', fakeAsync(() => {
      const spy = jest.spyOn(component as any, 'navigateToCurrentWithKeywordsParams');
      jest.spyOn(historyService, 'getAudiences').mockReturnValue(of(['test aud 1', 'test aud 2'] as any));
      component.onSubmit([]);
      tick(DEBOUNCE_TIME);
      expect(spy).toBeCalled();
    }));
    it('should call navigateToCurrentWithKeywordsParams on error', fakeAsync(() => {
      const spy = jest.spyOn(component as any, 'navigateToCurrentWithKeywordsParams');
      jest.spyOn(historyService, 'getAudiences').mockReturnValue(throwError('test'));
      component.onSubmit([]);
      tick(DEBOUNCE_TIME);
      expect(spy).toBeCalled();
    }));
  });

  describe('handleSearchEvent', () => {
    const DEBOUNCE_TIME = 100;

    it('should call clear suggestions', fakeAsync(() => {
      const spy = jest.spyOn(suggestionsService, 'clearSuggestions');
      (component as any).search$.next('dev');
      tick();
      expect(spy).toBeCalled();
      discardPeriodicTasks();
    }));

    it('should call fetch suggestions', fakeAsync(() => {
      const spy = jest.spyOn((component as any).suggestionsService, 'fetchAutoCompleteSuggestions');
      (component as any).search$.next('dev');
      tick(DEBOUNCE_TIME);
      expect(spy).toBeCalledWith('dev');
      discardPeriodicTasks();
    }));
  });

  describe('subscribeToSubmit', () => {
    it('should add sub to subscriptions', () => {
      const subs = (component as any).subscriptions;
      const spy = jest.spyOn(subs, 'add');
      (component as any).subscribeToSubmit();
      expect(spy).toBeCalled();
    });
  });

  describe('subscribeToSearchChange', () => {
    it('should add sub to subscriptions', () => {
      const subs = (component as any).subscriptions;
      const spy = jest.spyOn(subs, 'add');
      (component as any).subscribeToSearchChange();
      expect(spy).toBeCalled();
    });
  });

  describe('subscribeToSearchHistory', () => {
    it('should call add on subscriptionsw with this.historyService.subscribeToSearchHistory()', () => {
      const subs = (component as any).subscriptions;
      const spy = jest.spyOn(subs, 'add');
      jest.spyOn(historyService, 'subscribeToSearchHistory').mockReturnValue('test' as any);
      (component as any).subscribeToSearchHistory();
      expect(spy).toBeCalledWith('test');
    });
  });
});
