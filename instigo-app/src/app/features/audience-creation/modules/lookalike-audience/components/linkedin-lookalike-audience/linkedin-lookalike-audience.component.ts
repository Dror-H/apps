import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import {
  AdAccountDTO,
  AudienceAvailability,
  AudienceDto,
  AudienceLookalikeDto,
  AudienceType,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { concat, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-linkedin-lookalike-audience',
  templateUrl: './linkedin-lookalike-audience.component.html',
  styleUrls: ['./linkedin-lookalike-audience.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LinkedinLookalikeAudienceComponent),
      multi: true,
    },
  ],
})
export class LinkedinLookalikeAudienceComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() adAccount: AdAccountDTO = {} as AdAccountDTO;
  public isLoading = false;
  public lookalikeSources$: Observable<NzSelectOptionInterface[]>;
  public lookalikeSource: AudienceDto;
  public tipContent: string;

  private searchTerm: string;
  private lookalikeSpecs$ = new ReplaySubject<AudienceLookalikeDto[]>(1);
  private lookalikeSpecs: AudienceLookalikeDto[] = [{ originAudience: {} as AudienceDto }];
  private minAudienceSize = 300;
  private targetSearch$ = new Subject<string>();
  private subscriptions = new SubSink();

  constructor(private readonly audienceApiService: AudienceApiService) {
    this.tipContent = `Only audiences ready for use and superior or equal to ${this.minAudienceSize} members are shown below.`;
  }

  onChange: any = () => {};

  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(lookalikeSpecs: AudienceLookalikeDto[]): void {
    this.lookalikeSpecs$.next(lookalikeSpecs);
  }

  ngOnInit(): void {
    this.loadLookalikeSources();
    this.subscriptions.sink = this.lookalikeSpecs$.subscribe({
      next: (lookalikeSpecs) => {
        this.onChange({ list: lookalikeSpecs, reaches: [0] });
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onSearch(searchTerm: string): void {
    this.targetSearch$.next(searchTerm);
  }

  public onLookalikeSourceChange(source: AudienceDto): void {
    this.lookalikeSpecs[0].originAudience = source;
    this.lookalikeSpecs$.next(this.lookalikeSpecs);
  }

  public onLookalikeSourceSelectorOpened(): void {
    this.targetSearch$.next(this.searchTerm);
  }

  private loadLookalikeSources(): void {
    this.lookalikeSources$ = concat(
      of([]),
      this.targetSearch$.pipe(
        debounceTime(500),
        tap({
          next: (term) => {
            this.searchTerm = term;
            this.isLoading = true;
          },
        }),
        switchMap((term) =>
          this.getAudiences(term).pipe(
            catchError(() => of([])),
            tap(() => (this.isLoading = false)),
          ),
        ),
        map((items: any[]) => items.map((item) => ({ label: item.name, value: item }))),
      ),
    );
  }

  private buildQuery(searchTerm: string): RequestQueryBuilder {
    const qb = RequestQueryBuilder.create();
    const queryBuild = qb
      .setFilter({ field: 'provider', operator: CondOperator.EQUALS, value: SupportedProviders.LINKEDIN })
      .setFilter({ field: 'size', operator: CondOperator.GREATER_THAN_EQUALS, value: this.minAudienceSize })
      .setFilter({ field: 'type', operator: CondOperator.EQUALS, value: AudienceType.CUSTOM_AUDIENCE })
      .setFilter({ field: 'availability', operator: CondOperator.EQUALS, value: AudienceAvailability.READY })
      .setFilter({ field: 'adAccount.id', operator: CondOperator.EQUALS, value: this.adAccount.id })
      .sortBy({ field: 'createdAt', order: 'DESC' })
      .resetCache();

    if (searchTerm) {
      queryBuild.setFilter([{ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm }]);
    }
    queryBuild.sortBy({ field: 'name', order: 'ASC' });
    return queryBuild;
  }

  private getAudiences(searchTerm = ''): Observable<AudienceDto[]> {
    return this.audienceApiService.findAll(this.buildQuery(searchTerm).query());
  }
}
