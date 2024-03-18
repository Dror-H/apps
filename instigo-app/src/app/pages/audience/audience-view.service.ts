import { Injectable, OnDestroy } from '@angular/core';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { TableState } from '@app/shared/data-table/data-table.model';
import { baseQueryFromTableState, tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import { AudienceAvailability, AudienceType, RxStore, SupportedProviders } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { WorkspaceState } from '../state/workspace.state';

export interface AudiencesFilter {
  providers: { label: string; value: SupportedProviders; checked: boolean }[];
  adAccounts: any[];
  status: {
    label: string;
    status: AudienceAvailability;
    icon: any;
    checked: boolean;
  }[];
  types: {
    label: string;
    value: AudienceType;
    icon: any;
    checked: boolean;
  }[];
}

const defaultFilters = {
  providers: [
    { label: 'LinkedIn Ads', value: SupportedProviders.LINKEDIN, checked: true },
    { label: 'Facebook Ads', value: SupportedProviders.FACEBOOK, checked: true },
  ],
  adAccounts: [],
  status: [
    {
      label: 'Ready',
      status: AudienceAvailability.READY,
      icon: 'fas fa-check',
      checked: true,
    },
    {
      label: 'Not Ready',
      status: AudienceAvailability.NOT_READY,
      icon: 'fas fa-times',
      checked: true,
    },
    {
      label: 'Expired',
      status: AudienceAvailability.EXPIRED,
      icon: 'fas fa-hourglass-end',
      checked: true,
    },
  ],
  types: [
    {
      label: 'Custom audience',
      value: AudienceType.CUSTOM_AUDIENCE,
      icon: 'fad fa-user-clock',
      checked: true,
    },
    {
      label: 'Lookalike',
      value: AudienceType.LOOKALIKE_AUDIENCE,
      icon: 'fad fa-people-arrows',
      checked: true,
    },
    {
      label: 'Saved audience',
      value: AudienceType.SAVED_AUDIENCE,
      icon: 'fad fa-user-friends',
      checked: true,
    },
  ],
};
@Injectable()
export class AudienceViewService implements OnDestroy {
  public audienceTableState = new RxStore<TableState>(new TableState());
  public targetingTableState = new RxStore<TableState>(new TableState());
  public filters = new RxStore<AudiencesFilter>(defaultFilters);
  public refresh$ = new BehaviorSubject(null);
  private subsink = new SubSink();

  constructor(
    private store: Store,
    private readonly audienceApiService: AudienceApiService,
    private readonly targetingApiService: TargetingApiService,
  ) {
    this.subsink.sink = this.store.select(WorkspaceState.get).subscribe((workspace) => {
      const adAccounts = workspace?.adAccounts
        ? [...workspace?.adAccounts.map((adAccount) => ({ ...adAccount, checked: true }))]
        : null;
      this.filters.patchState({ adAccounts });
    });
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public audiences$(): Observable<any> {
    const tableState$ = tableStateChanges$(this.audienceTableState.state$);
    const filter$ = this.filters.state$.pipe(debounceTime(300), distinctUntilChanged());
    return combineLatest([tableState$, filter$, this.refresh$.asObservable()]).pipe(
      switchMap(([tableState, filters]) => {
        const query = this.buildAudienceQuery({ tableState, filters });
        return this.audienceApiService.findAll(query).pipe(
          tap((response) => {
            this.audienceTableState.patchState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((audiences) =>
            audiences?.map((audience) => ({
              ...audience,
              size: audience.size === -1 ? '-' : audience.size,
            })),
          ),
          catchError((err) => of([])),
        );
      }),
    );
  }

  public targeting$(): Observable<any[]> {
    const tableState$ = tableStateChanges$(this.targetingTableState.state$);
    const filter$ = this.filters.state$.pipe(debounceTime(300), distinctUntilChanged());
    return combineLatest([tableState$, filter$, this.refresh$.asObservable()]).pipe(
      switchMap(([tableState, filters]) => {
        const query = this.buildTargetingQuery({ tableState, filters });
        return this.targetingApiService.findAll(query).pipe(
          tap((response) => {
            this.targetingTableState.patchState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((targetings) => targetings || []),
          catchError((err) => of([])),
        );
      }),
    );
  }

  private buildAudienceQuery({ tableState, filters }): string {
    const { status } = filters;
    let query = baseQueryFromTableState({ tableState });
    query = this.baseFilter({ filters, query });
    query.setFilter({
      field: 'availability',
      operator: CondOperator.IN,
      value:
        status
          .filter((stat) => stat.checked)
          .map((stat) => stat.status)
          .join(',') || 'no-status',
    });
    return query.query();
  }

  private buildTargetingQuery({ tableState, filters }): string {
    let query = baseQueryFromTableState({ tableState });
    query = this.baseFilter({ filters, query });
    return query.query();
  }

  private baseFilter({ filters, query }): RequestQueryBuilder {
    const { providers, adAccounts, types } = filters;
    query.setFilter({
      field: 'adAccount.id',
      operator: CondOperator.IN,
      value:
        adAccounts
          .filter((adaccount) => adaccount.checked)
          .map((adAccount) => adAccount.id)
          .join(',') || '38f0cda2-008b-417e-bf68-1a355ecc3e54', // ! hack,,
    });
    query.setFilter({
      field: 'provider',
      operator: CondOperator.IN,
      value:
        providers
          .filter((provider) => provider.checked)
          .map((provider) => provider.value)
          .join(',') || 'empty',
    });

    query.setFilter({
      field: 'type',
      operator: CondOperator.IN,
      value:
        types
          .filter((type) => type.checked)
          .map((type) => type.value)
          .join(',') || '',
    });
    return query;
  }
}
