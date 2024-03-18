import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@audience-app/global/models/app.models';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { LoadingService } from '@audience-app/global/services/loading/loading.service';
import { getArrayFromParams } from '@audience-app/global/utils/param-utils';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { LoadingState } from '@audience-app/store/loading.state';
import { UserState } from '@audience-app/store/user.state';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { getProcessedValues } from '@instigo-app/ui/shared';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { delay, exhaustMap, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

export const INCREASE_VISIBLE_CARDS_COUNT_BY = 6;

@Component({
  selector: 'audi-audience-cards-container',
  templateUrl: './audience-cards-container.component.html',
  styleUrls: ['./audience-cards-container.component.scss'],
})
export class AudienceCardsContainerComponent implements OnInit, OnDestroy {
  @Select(UserState.getUserAndAdAccounts) user$: Observable<User>;
  @Select(LoadingState.getIsLoadingAudiences) isLoadingAudiences$: Observable<boolean>;
  @Select(LoadingState.getIsLoadingStatic) isLoadingStatic$: Observable<boolean>;
  @ViewSelectSnapshot(AudiencesState.getFoundAudiences) foundAudiences: SearchResult[];
  @ViewSelectSnapshot(AudiencesState.getSelectedAudiences) selectedAudiences: SearchResult[];

  public visibleCardsCount = INCREASE_VISIBLE_CARDS_COUNT_BY;
  public isLoadingMore = false;
  public isLoadMoreDisabled = false;
  public loadMoreMessage: string;

  private selectedKeywords: string[];
  private subscription = new SubSink();
  private loadMore$ = new Subject<SearchResult[]>();

  constructor(
    private audiencesService: AudiencesService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.subscribeToParamsForKeywords();
    this.subscribeToLoadMore();
    this.subscribeToIsLoading();
    this.subscribeToUser();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleSelectAudience(selectedAudience: SearchResult): void {
    this.isLoadingAudiences$
      .pipe(
        take(1),
        tap((isLoadingAudiences) => {
          if (!isLoadingAudiences) {
            this.audiencesService.toggleSelectAudience.emit(selectedAudience);
          }
        }),
      )
      .subscribe();
  }

  public isAudienceSelected(receivedAudience: SearchResult): boolean {
    return this.selectedAudiences.some((audience) => audience.id === receivedAudience.id);
  }

  public loadMoreAudiences(): void {
    this.loadMore$.next();
  }

  public audienceTrackBy(index: number, audience: SearchResult): string {
    return audience.id;
  }

  private subscribeToIsLoading(): void {
    this.subscription.add(
      combineLatest([this.isLoadingAudiences$, this.isLoadingStatic$])
        .pipe(
          tap(([isLoadingAudiences, isLoadingStatic]) => {
            this.isLoadingMore = isLoadingAudiences || isLoadingStatic;
          }),
        )
        .subscribe(),
    );
  }

  private subscribeToParamsForKeywords(): void {
    this.subscription.add(
      this.route.queryParamMap.subscribe((params) => {
        const keywordsParam = params.get('keywords');
        const selectedKeywords = getArrayFromParams(keywordsParam);
        this.selectedKeywords = getProcessedValues(selectedKeywords);
        this.resetVisibleCardsCount();
      }),
    );
  }

  private subscribeToUser(): void {
    this.subscription.add(
      this.user$
        .pipe(
          tap((user) => {
            this.isLoadMoreDisabled = !user?.stripeSubscriptionId;
            this.loadMoreMessage = !user
              ? 'app.audience.notLoggedIn'
              : !user.stripeSubscriptionId
              ? 'app.audience.noSubscription'
              : null;
          }),
        )
        .subscribe(),
    );
  }

  private resetVisibleCardsCount(): void {
    this.visibleCardsCount = INCREASE_VISIBLE_CARDS_COUNT_BY;
  }

  private increaseVisibleCardsCount(): void {
    this.visibleCardsCount += INCREASE_VISIBLE_CARDS_COUNT_BY;
  }

  private subscribeToLoadMore(): void {
    this.subscription.add(
      this.loadMore$
        .pipe(
          exhaustMap(() => this.getNewAudiencesIfFoundExceedLimit()),
          tap(() => {
            this.increaseVisibleCardsCount();
          }),
        )
        .subscribe(),
    );
  }

  private getAudiencesByKeywords(): Observable<SearchResult[]> {
    return this.audiencesService
      .getAudiencesByKeywords({
        keywords: this.selectedKeywords,
        offset: this.visibleCardsCount,
      })
      .pipe(tap((audiences) => this.audiencesService.addFoundAudiences.emit(audiences)));
  }

  private getNewAudiencesIfFoundExceedLimit(): Observable<SearchResult[] | null> {
    if (this.visibleCardsCount + INCREASE_VISIBLE_CARDS_COUNT_BY < this.foundAudiences.length) {
      return this.onStaticLoading();
    }
    return this.getAudiencesByKeywords();
  }

  private onStaticLoading(): Observable<null> {
    return of(null).pipe(
      tap(() => this.loadingService.isLoadingStatic.emit(true)),
      delay(10), //* for static loading spinner to appear while ui is repainting
      tap(() => this.loadingService.isLoadingStatic.emit(false)),
    );
  }
}
