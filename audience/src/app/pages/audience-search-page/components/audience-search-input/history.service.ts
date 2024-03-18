import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { getProcessedValues } from '@instigo-app/ui/shared';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HistoryService {
  public selectedKeywords: string[] = [];
  public searchHistory$ = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly audiencesService: AudiencesService,
    private readonly route: ActivatedRoute,
    private readonly loadingService: LoadingService,
    private readonly store: Store,
  ) {}

  public removeSearchHistoryValue(value: string): void {
    this.audiencesService.removeSearchHistoryValue.emit(value);
  }

  public updateSearchHistory(selectedKeywords: string[]): void {
    this.selectedKeywords = selectedKeywords;
    this.addLatestKeywordToSearchHistory(selectedKeywords);
  }

  public getAudiences(selectedKeywords?: string[]): Observable<SearchResult[] | null> {
    if (!selectedKeywords?.length) {
      this.resetFoundAudiences();
      this.loadingService.isLoadingAudiences.emit(false);
      return of(null);
    }
    return this.audiencesService
      .getAudiencesByKeywords({ keywords: selectedKeywords })
      .pipe(tap((audiences) => this.audiencesService.setFoundAudiences.emit(audiences)));
  }

  public handleParamsKeywords(): void {
    const params = this.route.snapshot.queryParams;
    if (params.keywords) {
      const selectedKeywords = Array.isArray(params.keywords) ? params.keywords : [params.keywords];
      this.selectedKeywords = getProcessedValues(selectedKeywords);
      this.setSearchHistoryState(this.selectedKeywords);
    }
  }

  public subscribeToSearchHistory(): Subscription {
    return this.store
      .select((state) => state.audiences.searchHistory)
      .subscribe((searchHistory) => {
        this.searchHistory$.next([...searchHistory]);
        if (searchHistory.length > 1) {
          this.searchHistory$.next(this.searchHistory$.value.reverse());
        }
      });
  }

  public removeAllSelectedKeywords(): void {
    this.selectedKeywords = [];
  }

  private addLatestKeywordToSearchHistory(keywords: string[]): void {
    if (keywords.length) {
      const mostRecentValue = keywords[keywords.length - 1];
      this.audiencesService.addSearchHistoryValue.emit(mostRecentValue);
    }
  }

  private setSearchHistoryState(keywords: string[]): void {
    this.audiencesService.setSearchHistory.emit(keywords);
  }

  private resetFoundAudiences(): void {
    this.audiencesService.setFoundAudiences.emit(null);
  }
}
