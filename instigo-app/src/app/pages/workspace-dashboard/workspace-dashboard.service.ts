import { Injectable } from '@angular/core';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { NotificationApiService } from '@app/api/services/notification-api.service';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { getTimeQueryParams } from '@app/global/get-time-query-params';
import { datePresets } from '@app/global/utils';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { ObservableLoadingInterface, ObservableType } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Select } from '@ngxs/store';
import { endOfDay, subDays } from 'date-fns';
import { BehaviorSubject, combineLatest, concat, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, share, switchMap, take } from 'rxjs/operators';
import { prepActivity, WorkspaceActivity } from '@app/pages/workspace-dashboard/workspace-dashboard-utils';
import { getConversionRelatedFields } from '@instigo-app/data-transfer-object';

@Injectable()
export class WorkspaceDashboardService {
  @Select(WorkspaceState.workspaceId)
  workspaceId$: Observable<string>;

  public currentDate = new Date();
  public datePresets = [
    datePresets(this.currentDate)[1],
    datePresets(this.currentDate)[5],
    datePresets(this.currentDate)[6],
  ];

  public currentDatePreset$ = new BehaviorSubject(this.datePresets[0]);

  constructor(
    private workspaceApiService: WorkspaceApiService,
    private readonly campaignApiService: CampaignApiService,
    private notificationApiService: NotificationApiService,
  ) {}

  workspaceMembers(): Observable<ObservableLoadingInterface<any[]>> {
    return concat(
      of({ type: ObservableType.START }),
      this.workspaceId$.pipe(
        filter((id) => !!id),
        switchMap((id) =>
          this.workspaceApiService.findOne({ id }).pipe(
            map((workspace) => [workspace.members, workspace.owner]),
            map((value) => ({ type: ObservableType.FINISH, value })),
          ),
        ),
        share(),
      ),
    );
  }

  workspaceActivity({ takeNo }): Observable<{ data: WorkspaceActivity[]; count: number }> {
    return this.notificationApiService.activity({ takeNo: takeNo }).pipe(
      map((response: any) => {
        const data = response?.data.map((item) => prepActivity(item));
        return { data, count: response?.count };
      }),
      catchError((error) => {
        console.error(error);
        return of({ data: [], count: 0 });
      }),
    );
  }

  markActivityRead(activity: any): void {
    this.notificationApiService
      .markAsRead({ notification: [activity] })
      .pipe(take(1))
      .subscribe((data) => data);
  }

  getLatestCampaigns({ state$ }) {
    const mapCampaigns = (campaigns) =>
      campaigns?.map((campaign) => {
        const conversionsRelated = getConversionRelatedFields(campaign?.insights?.summary, campaign.actionTypeField);
        return {
          currency: campaign.adAccount.currency,
          ...campaign,
          ...campaign.insights.summary,
          ...conversionsRelated,
        };
      }) || [];

    return this.workspaceId$.pipe(
      filter((id) => (id ? true : false)),
      distinctUntilChanged(),
      switchMap(() =>
        concat(
          of({ type: ObservableType.START }),
          state$
            .pipe(
              distinctUntilChanged(
                (prev: any, curr: any) =>
                  prev.page === curr.page &&
                  prev.limit === curr.limit &&
                  prev.sortColumn === curr.sortColumn &&
                  prev.searchTerm === curr.searchTerm &&
                  prev.sortDirection === curr.sortDirection,
              ),
            )
            .pipe(
              switchMap((state) =>
                this.campaignApiService.insights({ query: this.getQuery(state) }).pipe(
                  map((value) => ({
                    type: ObservableType.FINISH,
                    value: { ...value, data: mapCampaigns(value.data) },
                  })),
                ),
              ),
            ),
        ),
      ),
    );
  }

  getQuery(state) {
    const { page, limit, searchTerm, sortColumn, sortDirection } = state;
    const qb = RequestQueryBuilder.create();
    const query = qb.setLimit(limit).setPage(page);
    if (sortColumn && sortDirection) {
      query.sortBy({ field: sortColumn, order: sortDirection.toUpperCase() });
    }

    if (searchTerm) {
      query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm });
    }

    query.setFilter({ field: 'status', operator: CondOperator.EQUALS_LOW, value: 'active' });
    query.sortBy({ field: 'createdAt', order: 'DESC' });
    return `${query.query()}&${getTimeQueryParams({
      dateRange: {
        start: subDays(new Date(), 30),
        end: endOfDay(new Date()),
      },
    })}&provider_parameters={ "fields": ["social_spend", "actions"] }`;
  }

  get(): Observable<ObservableLoadingInterface<any>> {
    return combineLatest([this.currentDatePreset$, this.workspaceId$]).pipe(
      filter(([_, workspaceId]) => !!workspaceId),
      switchMap(([time]) =>
        concat(
          of({ type: ObservableType.START }),
          of({}).pipe(
            switchMap((_) =>
              this.workspaceApiService
                .dashboard(
                  `?${getTimeQueryParams({
                    dateRange: time.range,
                  })}`,
                )
                .pipe(map((value) => ({ type: ObservableType.FINISH, value }))),
            ),
            share(),
          ),
        ),
      ),
    );
  }
}
