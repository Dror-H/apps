import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import {
  AdAccountDTO,
  AudienceType,
  SupportedProviders,
  TargetingTemplateDto,
} from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, skip, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AUDIENCE_PAGINATION_SIZE } from '@app/global/utils';
import { AudienceApiService } from '@app/api/services/audience.api.service';

@Component({
  selector: 'ingo-saved-audience-selector',
  templateUrl: './saved-audience-selector.component.html',
  styleUrls: ['./saved-audience-selector.component.scss'],
})
export class SavedAudienceSelectorComponent implements OnInit, OnDestroy {
  @Input()
  adAccount: AdAccountDTO;
  @Input()
  selectedAudience: TargetingTemplateDto;
  @Output()
  public savedAudienceEmitter = new EventEmitter<TargetingTemplateDto>();

  public loadMoreAudiences$ = new BehaviorSubject<number>(0);
  public shouldLoadMore = true;
  public sources: any[] = [];
  public targetingList: TargetingTemplateDto[] = [];

  private searchTerm: string;
  private isTargeting = false;
  private sourceSearch$ = new BehaviorSubject<string>('');
  private subscriptions = new SubSink();

  constructor(
    private readonly targetingService: TargetingApiService,
    private readonly audienceApiService: AudienceApiService,
  ) {}

  @Input()
  set targeting(targeting: boolean) {
    this.sources = [];
    this.isTargeting = targeting;
    this.loadMoreAudiences$.next(0);
  }

  public compareFn = (audience1: any, audience2: any): boolean =>
    audience1 && audience2 ? audience1.id === audience2.id : audience1 === audience2;

  ngOnInit(): void {
    this.initializeSourcesIfSelectedAudience();
    this.transformAudiences();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onSearch(searchTerm: string): void {
    this.sourceSearch$.next(searchTerm);
  }

  public onSelectorOpened(): void {
    this.sourceSearch$.next(this.searchTerm);
  }

  public onSourceChange($event): void {
    this.selectedAudience = $event;
    this.savedAudienceEmitter.emit(this.selectedAudience);
  }

  public loadMoreCustomAudiences() {
    const previousValue = this.loadMoreAudiences$.value;
    this.loadMoreAudiences$.next(previousValue + AUDIENCE_PAGINATION_SIZE);
  }

  private transformAudiences(): void {
    this.subscriptions.sink = combineLatest([this.loadMoreAudiences$, this.sourceSearch$])
      .pipe(
        switchMap(([offset, searchTerm]) => this.getTargeting(offset, searchTerm)),
        debounceTime(500),
        skip(1),
        tap(({ items }) => {
          const aux = new Set();
          items.forEach((item) => {
            aux.add(JSON.stringify(item));
          });
          this.sources.forEach((item) => aux.add(JSON.stringify(item)));
          this.sources = Array.from(aux).map((item) => JSON.parse(item as string));
        }),
      )
      .subscribe();
  }

  private getTargeting(offset = 0, searchTerm = ''): Observable<{ items: any[] }> {
    if (this.isTargeting) {
      return this.targetingService.findAll(this.buildTargetingQuery(offset, searchTerm).query()).pipe(
        map((items) => {
          this.shouldLoadMore = offset + AUDIENCE_PAGINATION_SIZE < items.total;
          return { items: items.data };
        }),
      );
    } else {
      return this.audienceApiService.findAll(this.buildTargetingQuery(offset, searchTerm).query()).pipe(
        map((items) => {
          this.shouldLoadMore = offset + AUDIENCE_PAGINATION_SIZE < items.total;
          return { items: items.data };
        }),
      );
    }
  }

  private buildTargetingQuery(offset: number, searchTerm?: string): RequestQueryBuilder {
    const qb = RequestQueryBuilder.create();
    const queryBuild = qb
      .setFilter({ field: 'provider', operator: CondOperator.EQUALS, value: SupportedProviders.FACEBOOK })
      .setFilter({
        field: 'adAccount.id',
        operator: CondOperator.EQUALS,
        value: this.adAccount.id,
      })
      .resetCache();

    if (!this.isTargeting) {
      queryBuild.setFilter({
        field: 'type',
        operator: CondOperator.IN,
        value: [AudienceType.SAVED_AUDIENCE],
      });
    }

    if (searchTerm) {
      queryBuild.setFilter([{ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm }]);
    }
    queryBuild.setLimit(AUDIENCE_PAGINATION_SIZE);
    queryBuild.setOffset(offset);
    queryBuild.sortBy({ field: 'name', order: 'ASC' });
    return queryBuild;
  }

  private initializeSourcesIfSelectedAudience() {
    if (this.selectedAudience.id == null) {
      return;
    }
    this.getTargeting(0, this.selectedAudience.name).subscribe(({ items }) => {
      this.sources = items;
    });
  }
}
