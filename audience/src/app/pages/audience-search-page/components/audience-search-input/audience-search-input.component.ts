import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { HistoryService } from '@audience-app/pages/audience-search-page/components/audience-search-input/history.service';
import { LOADING_MESSAGES } from '@audience-app/pages/audience-search-page/components/audience-search-input/loading-messages.data';
import { SuggestionsService } from '@audience-app/pages/audience-search-page/components/audience-search-input/suggestions.service';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { LoadingState } from '@audience-app/store/loading.state';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { getProcessedValues, getSanitizedSearchValue } from '@instigo-app/ui/shared';
import { Select, Store } from '@ngxs/store';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, retry, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'audi-audience-search-input',
  templateUrl: './audience-search-input.component.html',
})
export class AudienceSearchInputComponent implements OnInit, OnDestroy {
  @Select(LoadingState.getIsLoadingAudiences) public isLoadingAudiences$: Observable<boolean>;
  @Select(LoadingState.getIsLoadingKeywordsSuggestions) public isLoadingKeywordsSuggestions$: Observable<boolean>;
  @ViewChild('searchSelect') public nzSelect: NzSelectComponent;
  @ViewChild('loadingMessagesRef', { static: true }) public loadingMessagesRef: TemplateRef<unknown>;

  public suggestions$: BehaviorSubject<string[]>;
  public isLoadingSuggestions$: BehaviorSubject<boolean>;
  public searchHistory$: BehaviorSubject<string[]>;
  public selectedKeywords: string[] = [];
  public keywordsSuggestions$: BehaviorSubject<string[]>;
  public searchValue = '';
  public environment = environment;
  public loadingMessages = {
    data: LOADING_MESSAGES,
    msBetweenMessages: 2500,
  };

  private search$ = new Subject<string[]>();
  private submit$ = new Subject<string[]>();
  private subscriptions = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly historyService: HistoryService,
    private readonly suggestionsService: SuggestionsService,
    private readonly displayNotification: DisplayNotificationService,
    private readonly store: Store,
  ) {
    this.suggestions$ = this.suggestionsService.suggestions$;
    this.isLoadingSuggestions$ = this.suggestionsService.isLoadingSuggestions$;
    this.searchHistory$ = this.historyService.searchHistory$;
    this.keywordsSuggestions$ = this.suggestionsService.keywordsSuggestions$;
  }

  ngOnInit(): void {
    this.handleParamsOnInit();
    this.subscribeToSearchChange();
    this.subscribeToSearchHistory();
    this.subscribeToSubmit();
  }

  ngOnDestroy(): void {
    this.resetHistorySelectedKeywords();
    this.subscriptions.unsubscribe();
  }

  public onSelectedKeywordSuggestion(selectedKeywordSuggestion: string): void {
    this.selectedKeywords = getProcessedValues([...this.selectedKeywords, selectedKeywordSuggestion]);
    this.onSubmit(this.selectedKeywords);
    this.onSearch('');
  }

  public onSearch(searchValue: string): void {
    this.searchValue = getSanitizedSearchValue(searchValue);
    if (!this.selectedKeywords.length && !searchValue) {
      return;
    }
    const keywords = [...this.selectedKeywords, searchValue];
    const sanitizedKeywords = getProcessedValues(keywords);
    this.search$.next(sanitizedKeywords);
  }

  public onSubmit(selectedKeywords?: string[]): void {
    this.submit$.next(selectedKeywords);
    this.onSearch('');
  }

  public isSelected(value?: string): boolean {
    return this.selectedKeywords.indexOf(getSanitizedSearchValue(value)) > -1;
  }

  public removeSearchHistoryValue(value: string, ev: Event): void {
    ev.stopPropagation();
    this.historyService.removeSearchHistoryValue(value);
  }

  public refreshAIKeywordsSuggestions(): void {
    const audiences = this.store.selectSnapshot(AudiencesState.getFoundAudiences);
    this.fetchAIKeywordsSuggestions$(audiences).subscribe();
  }

  public fetchAIKeywordsSuggestions$(audiences: SearchResult[]): Observable<string[]> {
    return this.suggestionsService.fetchAIKeywordsSuggestions(audiences, this.historyService.selectedKeywords);
  }

  private handleParamsOnInit(): void {
    this.historyService.handleParamsKeywords();
    this.selectedKeywords = this.historyService.selectedKeywords;
    this.getAudiences$().subscribe();
  }

  private getAudiences$(): Observable<string[]> {
    const notificationRef = this.displayNotification.displayTemplateNotification(this.loadingMessagesRef, {
      nzDuration: 50000,
      nzClass: 'loading',
    });

    return this.historyService.getAudiences(this.selectedKeywords).pipe(
      switchMap((audiences) => this.fetchAIKeywordsSuggestions$(audiences)),
      finalize(() => {
        this.displayNotification.removeNotification(notificationRef.messageId);
      }),
    );
  }

  private handleSubmitEventBeforeApiCalls(selectedKeywords: string[]): void {
    this.closeDropdown();
    this.selectedKeywords = getProcessedValues(selectedKeywords);
    this.historyService.updateSearchHistory(this.selectedKeywords);
    this.suggestionsService.clearSuggestions();
  }

  private handleSubmitEvent(): (source$: Observable<string[]>) => Observable<unknown[]> {
    return (source$: Observable<string[]>): Observable<unknown[]> =>
      source$.pipe(
        tap((selectedKeywords: string[]) => {
          this.handleSubmitEventBeforeApiCalls(selectedKeywords);
        }),
        debounceTime(300),
        switchMap(() => this.getAudiences$()),
        tap({
          next: () => this.navigateToCurrentWithKeywordsParams(),
          error: () => this.navigateToCurrentWithKeywordsParams(),
        }),
        retry(),
      );
  }

  private handleSearchEvent(): (source$: Observable<string[]>) => Observable<unknown[]> {
    return (source$: Observable<string[]>): Observable<unknown[]> =>
      source$.pipe(
        tap(() => this.suggestionsService.clearSuggestions()),
        debounceTime(100),
        switchMap((keywords) => this.suggestionsService.fetchAutoCompleteSuggestions(keywords)),
        retry(),
      );
  }

  private navigateToCurrentWithKeywordsParams(): void {
    void this.router.navigate([], { queryParams: { keywords: this.selectedKeywords } });
  }

  private resetHistorySelectedKeywords(): void {
    this.historyService.removeAllSelectedKeywords();
  }

  private closeDropdown(): void {
    if (this.nzSelect.nzOpen) {
      this.nzSelect.nzOpen = false;
    }
  }

  private subscribeToSubmit(): void {
    this.subscriptions.add(this.submit$.pipe(this.handleSubmitEvent()).subscribe());
  }

  private subscribeToSearchChange(): void {
    this.subscriptions.add(this.search$.pipe(this.handleSearchEvent()).subscribe());
  }

  private subscribeToSearchHistory(): void {
    this.subscriptions.add(this.historyService.subscribeToSearchHistory());
  }
}
