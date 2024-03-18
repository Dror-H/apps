import { Injectable, OnDestroy } from '@angular/core';
import { AdSetApiService } from '@app/api/services/ad-set.api.service';
import { AdApiService } from '@app/api/services/ad.api.service';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { TableState } from '@app/shared/data-table/data-table.model';
import { baseQueryFromTableState, tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import {
  AdDTO,
  AdSetDTO,
  CampaignDTO,
  CampaignStatusType,
  DateTimeInterval,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { isEmpty } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { SessionState } from '../adaccount-dashboard/session-state.state';
import { WorkspaceState } from '../state/workspace.state';
import { convertDatePresetToDateRange, getInitialLoadDateRange } from './filter.help';

const defaultFilters = {
  datePreset: { dateRange: getInitialLoadDateRange(), datePreset: null },
  providers: [
    { label: 'LinkedIn Ads', value: SupportedProviders.LINKEDIN, checked: true },
    { label: 'Facebook Ads', value: SupportedProviders.FACEBOOK, checked: true },
  ],
  adAccounts: [],
  status: [
    {
      label: 'Active',
      status: CampaignStatusType.ACTIVE,
      icon: 'fas fa-play',
      checked: true,
    },
    {
      label: 'Paused',
      status: CampaignStatusType.PAUSED,
      icon: 'fas fa-pause',
      checked: true,
    },
    {
      label: 'Deleted',
      status: CampaignStatusType.DELETED,
      icon: 'fas fa-trash',
      checked: true,
    },
    {
      label: 'Archived',
      status: CampaignStatusType.ARCHIVED,
      icon: 'fas fa-box-archive',
      checked: true,
    },
  ],
};

export interface CampaignsFilter {
  datePreset: DateTimeInterval;
  providers: Array<{ label: string; value: SupportedProviders; checked: boolean }>;
  adAccounts: Array<any>;
  status: Array<{
    label: string;
    status: CampaignStatusType;
    icon: string;
    checked: boolean;
  }>;
}

@Injectable()
export class CampaignsViewService implements OnDestroy {
  public activeTab$ = new BehaviorSubject(0);
  public filters$ = new BehaviorSubject<Partial<CampaignsFilter>>(defaultFilters);
  public campaignsTableState$ = new BehaviorSubject(new TableState());
  public adSetsTableState$ = new BehaviorSubject(new TableState());
  public adsTableState$ = new BehaviorSubject(new TableState());
  public refresh$ = new BehaviorSubject(null);
  private subSink = new SubSink();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  @SelectSnapshot(SessionState.selectedTimeInterval)
  private selectedTimeInterval: DateTimeInterval;

  constructor(
    private readonly campaignApiService: CampaignApiService,
    private readonly adSetApiService: AdSetApiService,
    private readonly adApiService: AdApiService,
    private store: Store,
  ) {
    this.updateFilters({ datePreset: this.selectedTimeInterval });
    this.setFilterWithAdAccountsOfWorkspace();
  }
  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public updateFilters(filters: Partial<CampaignsFilter>): void {
    this.filters$.next({ ...this.filters$.value, ...filters });
  }

  public updateCampaignsViewTableState(state: Partial<TableState>): void {
    this.campaignsTableState$.next({ ...this.campaignsTableState$.value, ...state });
  }

  public updateAdSetsViewTableState(state: Partial<TableState>): void {
    this.adSetsTableState$.next({ ...this.adSetsTableState$.value, ...state });
  }

  public updateAdsViewTableState(state: Partial<TableState>): void {
    this.adsTableState$.next({ ...this.adsTableState$.value, ...state });
  }

  public campaigns$(): Observable<CampaignDTO[]> {
    const tableState$ = tableStateChanges$(this.campaignsTableState$);
    const filter$ = this.filters$.pipe(debounceTime(300), distinctUntilChanged());
    return combineLatest([tableState$, filter$, this.refresh$]).pipe(
      distinctUntilChanged(),
      switchMap(([tableState, filters]) =>
        this.campaignApiService
          .tableInsights({
            query: this.buildCampaignsQuery({ tableState, filters }),
          })
          .pipe(
            tap((response) => {
              this.updateCampaignsViewTableState({ totalRecords: response.total });
            }),
            map((response) => response.data),
            catchError(() => of([])),
          ),
      ),
    );
  }

  public adSets$(): Observable<AdSetDTO[]> {
    const tableState$ = tableStateChanges$(this.adSetsTableState$);
    const campaignTableState$ = this.campaignsTableState$;
    const filter$ = this.filters$.pipe(debounceTime(300), distinctUntilChanged());
    return combineLatest([tableState$, campaignTableState$, filter$, this.refresh$]).pipe(
      distinctUntilChanged(),
      switchMap(([tableState, campaignsTableState, filters]) => {
        const query = this.buildAdSetsQuery({ tableState, campaignsTableState, filters });
        return this.adSetApiService
          .tableInsights({ query: `${query}&provider_parameters={"fields":["objective", "social_spend", "actions"]}` })
          .pipe(
            tap((response) => {
              this.updateAdSetsViewTableState({ totalRecords: response.total });
            }),
            map((response) => response.data),
            catchError(() => of([])),
          );
      }),
    );
  }

  public ads$(): Observable<AdDTO[]> {
    const tableState$ = tableStateChanges$(this.adsTableState$);
    const campaignsTableState$ = this.campaignsTableState$;
    const adSetsTableState$ = this.adSetsTableState$;
    const filter$ = this.filters$.pipe(debounceTime(300), distinctUntilChanged());
    return combineLatest([tableState$, campaignsTableState$, adSetsTableState$, filter$, this.refresh$]).pipe(
      distinctUntilChanged(),
      switchMap(([tableState, campaignsTableState, adSetsTableState, filters]) => {
        const query = this.buildAdsQuery({
          tableState,
          adSetsTableState,
          campaignsTableState,
          filters,
        });
        return this.adApiService
          .tableInsights({ query: `${query}&provider_parameters={"fields":["objective", "social_spend", "actions"]}` })
          .pipe(
            tap((response) => {
              this.updateAdsViewTableState({ totalRecords: response.total });
            }),
            map((response) => response.data),
            catchError((err) => of([])),
          );
      }),
    );
  }

  private setFilterWithAdAccountsOfWorkspace(): void {
    this.subSink.sink = this.store.select(WorkspaceState.get).subscribe((workspace) => {
      const adAccounts = workspace?.adAccounts
        ? [...workspace.adAccounts.map((adAccount) => ({ ...adAccount, checked: true }))]
        : null;
      this.updateFilters({ adAccounts });
    });
  }

  private buildCampaignsQuery({ tableState, filters }): string {
    const { datePreset } = filters;
    let query = baseQueryFromTableState({ tableState });
    query = this.baseFilter({ filters, query });
    return `${query.query()}&time_increment=all&time_range=${JSON.stringify(
      convertDatePresetToDateRange(datePreset),
    )}&provider_parameters={ "fields": ["social_spend", "actions"] }`;
  }

  private buildAdSetsQuery({ tableState, campaignsTableState, filters }): string {
    const { datePreset } = filters;
    let query = baseQueryFromTableState({ tableState });
    query = this.baseFilter({ filters, query });
    if (!isEmpty(campaignsTableState.selectedItems)) {
      query.setFilter({
        field: 'campaign.id',
        operator: CondOperator.IN,
        value: campaignsTableState.selectedItems.map((campaign) => campaign.id),
      });
    }
    return `${query.query()}&time_increment=all&time_range=${JSON.stringify(convertDatePresetToDateRange(datePreset))}`;
  }

  private buildAdsQuery({ tableState, adSetsTableState, campaignsTableState, filters }): string {
    const { datePreset } = filters;
    let query = baseQueryFromTableState({ tableState });
    query = this.baseFilter({ filters, query });
    if (!isEmpty(campaignsTableState.selectedItems)) {
      query.setFilter({
        field: 'campaign.id',
        operator: CondOperator.IN,
        value: campaignsTableState.selectedItems.map((campaign) => campaign.id),
      });
    }
    if (!isEmpty(adSetsTableState.selectedItems)) {
      query.setFilter({
        field: 'adSet.id',
        operator: CondOperator.IN,
        value: adSetsTableState.selectedItems.map((adSet) => adSet.id),
      });
    }
    return `${query.query()}&time_increment=all&time_range=${JSON.stringify(convertDatePresetToDateRange(datePreset))}`;
  }

  private baseFilter({ filters, query }): RequestQueryBuilder {
    const { providers, adAccounts, status } = filters;
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
      field: 'adAccount.id',
      operator: CondOperator.IN,
      value:
        adAccounts
          .filter((adaccount) => adaccount.checked)
          .map((adAccount) => adAccount.id)
          .join(',') || '38f0cda2-008b-417e-bf68-1a355ecc3e54', // ! hack,,
    });
    query.setFilter({
      field: 'status',
      operator: CondOperator.IN,
      value:
        status
          .filter((stat) => stat.checked)
          .map((stat) => stat.status)
          .join(',') || 'no-status',
    });

    return query;
  }
}
