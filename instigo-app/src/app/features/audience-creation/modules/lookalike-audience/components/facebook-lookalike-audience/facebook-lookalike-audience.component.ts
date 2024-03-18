import { Component, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import {
  AdAccountDTO,
  AudienceDto,
  AudienceLookalikeDto,
  AudienceTrackerDto,
  AudienceType,
  InstigoTargetingTypes,
  ReachOutputDto,
  SupportedProviders,
  TargetingAndDto,
  TargetingConditionDto,
  TargetingDto,
  TargetingExcludeDto,
  TargetingOrDto,
} from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { round } from 'lodash-es';
import { ChangeContext, Options, PointerType } from 'ng5-slider';
import { BehaviorSubject, concat, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, debounceTime, delay, distinctUntilChanged, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { AUDIENCE_PAGINATION_SIZE } from '@app/global/utils';

@Component({
  selector: 'ingo-facebook-lookalike-audience',
  templateUrl: './facebook-lookalike-audience.component.html',
  styleUrls: ['./facebook-lookalike-audience.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FacebookLookalikeAudienceComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FacebookLookalikeAudienceComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private static MIN_RATIO = 0;
  private static MAX_RATIO = 0.1;
  private static RATIO_STEP = 0.01;
  private static MIN_AUDIENCE_SIZE = 100;

  @Input() adAccount: AdAccountDTO = {} as AdAccountDTO;
  public MIN_COUNT = 1;
  public MAX_COUNT = 6;
  public lookalikeSpecsListCount = 1;
  public isLoading = false;
  public lookalikeSources$: BehaviorSubject<NzSelectOptionInterface[]> = new BehaviorSubject<NzSelectOptionInterface[]>(
    [],
  );
  public lookalikeSource: AudienceDto | AudienceTrackerDto;
  public lookalikeReaches$: Observable<number[]>;
  public lookalikeReaches: number[] = [0];
  public loadMore$ = new BehaviorSubject(0);
  public shouldLoadMore: boolean;
  public sliderOptions: Options = {
    floor: FacebookLookalikeAudienceComponent.MIN_RATIO,
    ceil: FacebookLookalikeAudienceComponent.MAX_RATIO,
    step: FacebookLookalikeAudienceComponent.RATIO_STEP,
    showTicks: true,
    translate: (value: number): string => `${Math.round(value * 100)}%`,
  };
  public lookalikeSpecs: AudienceLookalikeDto[] = [
    {
      originAudience: {} as AudienceDto,
      locationSpec: { include: { countries: [] }, exclude: {} },
      startingRatio: FacebookLookalikeAudienceComponent.MIN_RATIO,
      ratio: 0.01,
    },
  ];

  private lookalikeSpecs$ = new ReplaySubject<AudienceLookalikeDto[]>(1);
  private reachOutput: ReachOutputDto = { count: 0 };
  private searchTerm: string;
  private lookalikeSourceSearch$ = new Subject<string>();
  private subscriptions = new SubSink();
  private targeting: TargetingDto = {
    provider: SupportedProviders.FACEBOOK,
    include: {
      and: [
        {
          or: {
            countries: [],
          },
        },
      ],
    },
    exclude: {
      or: {},
    },
  };
  private lookalikeLocationSpec$ = new Subject<{
    locationObject: TargetingOrDto;
    locationType: InstigoTargetingTypes;
    scope: 'include' | 'exclude';
  }>();

  constructor(
    private readonly audienceApiService: AudienceApiService,
    private readonly targetingApiService: TargetingApiService,
  ) {}

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
    this.subscriptions.sink = this.lookalikeSpecs$.subscribe((lookalikeSpecs) => {
      this.recalculateReaches(this.reachOutput);
      this.onChange({ list: lookalikeSpecs, reaches: this.lookalikeReaches });
    });
    this.getLookalikeAudienceReaches();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onSearchLookalikeSource(searchTerm: string): void {
    this.lookalikeSourceSearch$.next(searchTerm);
  }

  public onLookalikeSourceSelectorOpened(): void {
    this.lookalikeSourceSearch$.next(this.searchTerm);
  }

  public onLookalikeSourceChange(source: AudienceDto): void {
    this.lookalikeSpecs = this.lookalikeSpecs.map((spec) => ({
      ...spec,
      originAudience: source,
    }));
    this.lookalikeSpecs$.next(this.lookalikeSpecs);
  }

  public onUpdateLookalikeSpecsCount(count: number): void {
    if (count > this.lookalikeSpecs.length && this.lookalikeSpecs.length < this.MAX_COUNT && count <= this.MAX_COUNT) {
      this.addLookalikeSpecs(count);
    } else if (
      count < this.lookalikeSpecs.length &&
      this.lookalikeSpecs.length > this.MIN_COUNT &&
      count >= this.MIN_COUNT
    ) {
      this.removeLookalikeSpecs(count);
    }
  }

  public getReachEventFromChild($event: {
    locationIncluded: TargetingAndDto;
    locationExcluded: TargetingExcludeDto;
  }): void {
    const include = 'include';
    this.targeting[include].and[0] = $event.locationIncluded;
    this.lookalikeLocationSpec$.next({
      locationObject: $event.locationIncluded,
      scope: include,
      locationType: InstigoTargetingTypes.COUNTRIES,
    });

    const exclude = 'exclude';
    this.targeting[exclude] = $event.locationExcluded;
    this.lookalikeLocationSpec$.next({
      locationObject: $event.locationExcluded,
      scope: exclude,
      locationType: InstigoTargetingTypes.COUNTRIES,
    });
  }

  public onUpdateLookalikeSpecsRatiosEnd(changeContext: ChangeContext): void {
    const { pointerType } = changeContext;
    let maxRatioRange = 6;
    this.lookalikeSpecs = this.lookalikeSpecs.map((spec, i, inputArray) => {
      const prevSpec = inputArray[i - 1];
      const nextSpec = inputArray[i + 1];
      if (pointerType === PointerType.Min) {
        if (nextSpec) {
          spec.ratio = round(nextSpec.startingRatio, 2);
        }
        if (prevSpec) {
          spec.startingRatio = round(prevSpec.ratio, 2);
        }
      } else if (pointerType === PointerType.Max && i > 0) {
        spec.startingRatio = round(prevSpec.ratio, 2);
      }
      if (round(spec.ratio, 2) <= round(spec.startingRatio, 2)) {
        spec.ratio = round(spec.ratio + FacebookLookalikeAudienceComponent.RATIO_STEP, 2);
      }
      if (spec.ratio >= FacebookLookalikeAudienceComponent.MAX_RATIO) {
        maxRatioRange = i + 1;
      }
      return spec;
    });

    this.MAX_COUNT = maxRatioRange;
    this.lookalikeSpecs$.next(this.lookalikeSpecs);
  }

  public loadMore() {
    const previousValue = this.loadMore$.value;
    this.loadMore$.next(previousValue + AUDIENCE_PAGINATION_SIZE);
  }

  private getLookalikeAudienceReaches(): void {
    this.lookalikeReaches$ = concat(
      of([]),
      this.lookalikeLocationSpec$.pipe(
        delay(500),
        tap(({ locationObject, locationType, scope }) => {
          const newValues = { [scope]: {} };
          if (locationObject.or[locationType]) {
            newValues[scope] = {
              [locationType]: locationObject.or[locationType].map((loc: TargetingConditionDto) => loc.providerId),
            };
          }

          // TODO: merge value properly if we add countryGroup selection too
          this.lookalikeSpecs = this.lookalikeSpecs.map((spec) => ({
            ...spec,
            locationSpec: { ...spec.locationSpec, ...newValues },
          }));
          this.lookalikeSpecs$.next(this.lookalikeSpecs);
        }),
        mergeMap(() => this.getLookalikeReach()),
      ),
    );
  }

  private buildAudienceQuery(offset = 0, searchTerm?: string): RequestQueryBuilder {
    const qb = RequestQueryBuilder.create();
    const queryBuild = qb
      .setFilter({ field: 'provider', operator: CondOperator.EQUALS, value: SupportedProviders.FACEBOOK })
      // .setFilter({
      //   field: 'size',
      //   operator: CondOperator.GREATER_THAN_EQUALS,
      //   value: FacebookLookalikeAudienceComponent.MIN_AUDIENCE_SIZE,
      // })
      .sortBy({ field: 'createdAt', order: 'DESC' })
      .setFilter({ field: 'type', operator: CondOperator.EQUALS, value: AudienceType.CUSTOM_AUDIENCE })
      .setFilter({
        field: 'adAccount.id',
        operator: CondOperator.EQUALS,
        value: this.adAccount.id,
      })
      .resetCache();

    if (searchTerm) {
      queryBuild.setFilter([{ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm }]);
    }
    queryBuild.setLimit(AUDIENCE_PAGINATION_SIZE);
    queryBuild.setOffset(offset);
    queryBuild.sortBy({ field: 'name', order: 'ASC' });
    return queryBuild;
  }

  private getAudiences(offset = 0, searchTerm = ''): Observable<AudienceDto[]> {
    return this.audienceApiService.findAll(this.buildAudienceQuery(offset, searchTerm).query());
  }

  private getLookalikeReach(): Observable<number[]> {
    const { include, exclude } = this.targeting;
    const targeting = { provider: SupportedProviders.FACEBOOK } as TargetingDto;
    if (Object.keys(include.and[0].or).length) {
      targeting.include = include;
    }
    if (Object.keys(exclude.or).length) {
      targeting.exclude = exclude;
    }
    return this.targetingApiService
      .reach({
        adAccountId: this.adAccount.providerId,
        provider: SupportedProviders.FACEBOOK,
        targeting,
      })
      .pipe(
        tap({
          next: (reach) => (this.reachOutput = reach),
        }),
        catchError(() => of({ count: 0 } as ReachOutputDto)),
        map((reach) => this.recalculateReaches(reach)),
      );
  }

  private recalculateReaches(reach: ReachOutputDto): number[] {
    this.lookalikeReaches = this.lookalikeSpecs.map((spec) => {
      const rate = spec.ratio - spec.startingRatio;
      return Math.round(reach.count * rate);
    });
    return this.lookalikeReaches;
  }

  private addLookalikeSpecs(count: number): void {
    const refIndex = this.lookalikeSpecs.length - 1;
    for (const e of Array.from(Array(count - this.lookalikeSpecs.length), (_, i) => i + refIndex)) {
      const { ratio: startingRatio } = this.lookalikeSpecs[e];
      const ratio = round(startingRatio + FacebookLookalikeAudienceComponent.RATIO_STEP, 2);
      if (ratio <= FacebookLookalikeAudienceComponent.MAX_RATIO) {
        this.lookalikeSpecs.push({ ...this.lookalikeSpecs[0], startingRatio, ratio });
      } else {
        this.MAX_COUNT = e + 1;
        break;
      }
    }
    this.lookalikeSpecs$.next(this.lookalikeSpecs);
  }

  private removeLookalikeSpecs(count: number): void {
    this.MAX_COUNT = 6;
    [...Array(this.lookalikeSpecs.length - count).keys()].forEach(() => {
      this.lookalikeSpecs.pop();
    });
    this.lookalikeSpecs$.next(this.lookalikeSpecs);
  }

  private loadLookalikeSources(): void {
    concat(
      of([]),
      this.lookalikeSourceSearch$.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap({
          next: (term) => {
            this.searchTerm = term;
            this.isLoading = true;
          },
        }),
        switchMap((term) => {
          this.isLoading = true;
          return this.loadMore$.pipe(map((offset) => ({ offset, term })));
        }),
        switchMap(({ offset, term }) =>
          this.getAudiences(offset, term).pipe(
            catchError(() => of([])),
            tap(() => {
              this.isLoading = false;
            }),
            map((items) => ({ items, offset })),
          ),
        ),
        tap(({ items, offset }) => (this.shouldLoadMore = offset + AUDIENCE_PAGINATION_SIZE < (items as any).total)),
        map(({ items, offset }) => (items as any).data.map((item) => ({ label: item.name, value: item }))),
      ),
    ).subscribe((result) => {
      const previousValue = this.lookalikeSources$.value;
      previousValue.push(...result);
      this.lookalikeSources$.next(previousValue);
    });
  }
}
