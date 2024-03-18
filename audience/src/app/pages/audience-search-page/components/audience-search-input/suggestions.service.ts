import { Injectable } from '@angular/core';
import { AudienceApiService } from '@audience-app/api/audience-api/audience-api.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { notificationOnErrorOperator } from '@audience-app/global/utils/operators';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

@Injectable()
export class SuggestionsService {
  public suggestions$ = new BehaviorSubject<string[]>([]);
  public keywordsSuggestions$ = new BehaviorSubject<string[]>([]);
  public isLoadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly audienceApiService: AudienceApiService,
    private readonly displayNotification: DisplayNotificationService,
    private readonly loadingService: LoadingService,
  ) {}

  public clearSuggestions(): void {
    this.suggestions$.next([]);
  }

  public fetchAIKeywordsSuggestions(audiences: SearchResult[], selectedKeywords?: string[]): Observable<string[]> {
    if (!selectedKeywords?.length) {
      this.keywordsSuggestions$.next([]);
      return of([]);
    }
    const audiencesIds = audiences.map(({ id }) => id);
    this.loadingService.isLoadingKeywordsSuggestions.emit(true);
    return this.audienceApiService.fetchAIKeywordsSuggestions(audiencesIds, selectedKeywords).pipe(
      tap((keywordsSuggestions) => {
        this.keywordsSuggestions$.next(keywordsSuggestions);
      }),
      notificationOnErrorOperator(this.displayNotification),
      finalize(() => this.loadingService.isLoadingKeywordsSuggestions.emit(false)),
    );
  }

  public fetchAutoCompleteSuggestions(keywords: string[]): Observable<string[]> {
    this.isLoadingSuggestions$.next(true);
    return this.audienceApiService.fetchAutoCompleteSuggestions(keywords).pipe(
      map((suggestions) => suggestions.map((suggestion) => suggestion.name)),
      tap((suggestions) => this.suggestions$.next(suggestions)),
      notificationOnErrorOperator(this.displayNotification),
      finalize(() => this.isLoadingSuggestions$.next(false)),
    );
  }
}
