import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { TableState } from '@app/shared/data-table/data-table.model';
import { tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import { CampaignDraftDTO, NotificationType } from '@instigo-app/data-transfer-object';
import { InputForModalComponent } from '@instigo-app/ui/shared';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

const defaultsFilter = {
  adAccounts: [],
};

@Injectable()
export class CampaignDraftService implements OnDestroy {
  public campaignsDraftTableState$ = new BehaviorSubject(new TableState());
  public refresh$ = new BehaviorSubject(null);
  public filters$ = new BehaviorSubject<Partial<{ adAccounts: any[] }>>(defaultsFilter);
  private name$ = new BehaviorSubject<string>('');
  private subscription = new SubSink();
  constructor(
    private campaignDraftService: CampaignDraftApiService,
    private modal: NzModalService,
    private displayNotification: DisplayNotification,
    private store: Store,
  ) {
    this.setFilterWithAdAccountsOfWorkspace();
  }

  public updateFilters(filters: any): void {
    this.filters$.next({ ...this.filters$.value, ...filters });
  }

  public updateCampaignsDraftViewTableState(state: Partial<TableState>): void {
    this.campaignsDraftTableState$.next({ ...this.campaignsDraftTableState$.value, ...state });
  }

  public drafts$(): Observable<CampaignDraftDTO[]> {
    const tableState$ = tableStateChanges$(this.campaignsDraftTableState$);
    const filter$ = this.filters$.pipe(debounceTime(400), distinctUntilChanged());
    return combineLatest([tableState$, filter$, this.refresh$.asObservable()]).pipe(
      switchMap(([tableState, filters]) => {
        const query = this.buildCampaignDraftQuery({ tableState, filters });
        return this.campaignDraftService.findAll(query).pipe(
          tap((response) => {
            this.updateCampaignsDraftViewTableState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((drafts) => {
            if (drafts?.length > 0) {
              return drafts.map((item) => ({
                ...item,
                name: item.draft.settings.name,
                adAccount: { ...item?.adAccount, name: item.draft.settings.account.name },
              }));
            }
            return [];
          }),
          catchError((err) => of([])),
        );
      }),
    );
  }

  public deleteDrafts(campaigns: CampaignDraftDTO) {
    const campaignDraftIds = campaigns.map(({ id }) => id);

    this.modal.confirm({
      nzTitle: 'Are you sure to delete the selected campaign drafts?',
      nzContent: `You won't be able to revert this!`,
      nzOkText: 'Delete',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.campaignDraftService
          .deleteMany({ campaignDraftIds: campaignDraftIds })
          .pipe(
            take(1),
            tap(() => {
              this.updateCampaignsDraftViewTableState({ selectedItems: [] });
              this.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  content: `Campaign drafts have been successfully deleted`,
                  type: NotificationType.SUCCESS,
                }),
              );
            }),
            catchError((err: HttpErrorResponse) => {
              this.displayNotification.displayNotification(
                new Notification({ content: err.message, type: NotificationType.ERROR }),
              );
              return throwError(new Error(err.message));
            }),
          )
          .subscribe();
      },
      nzCancelText: 'Cancel',
    });
  }

  ngOnDestroy(): void {
    this.campaignsDraftTableState$.unsubscribe();
    this.refresh$.unsubscribe();
    this.subscription.unsubscribe();
  }

  private setFilterWithAdAccountsOfWorkspace(): void {
    this.subscription.sink = this.store.select(WorkspaceState.get).subscribe((workspace) => {
      const adAccounts = workspace.adAccounts
        ? [...workspace.adAccounts.map((adAccount) => ({ ...adAccount, checked: true }))]
        : null;
      this.updateFilters({ adAccounts });
    });
  }

  public duplicate(item: any): void {
    const timeNow = new Date();
    const defaultName = `${item.name}-copy-${timeNow.getDate()}-${timeNow.getMonth() + 1}`;
    this.name$.next(defaultName);
    this.modal.create({
      nzTitle: 'Duplicate campaign draft',
      nzContent: InputForModalComponent,
      nzComponentParams: { entityNameSubject$: this.name$ },
      nzOkText: 'Duplicate',
      nzOkType: 'primary',
      nzWidth: 500,
      nzOkDisabled: !this.name$.value,
      nzOnOk: () => {
        const name = this.name$.value || defaultName;
        const payload = {
          ...item,
          name,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          version: undefined,
        };
        payload.draft.settings.name = name;
        this.subscription.sink = this.campaignDraftService
          .create({ payload })
          .pipe(
            take(1),
            tap((res) => {
              this.updateCampaignsDraftViewTableState({ selectedItems: [] });
              this.refresh$.next(null);
              this.displayNotification.displayNotification(
                new Notification({
                  title: `Your ${name} campaign draft has been duplicated.`,
                  type: NotificationType.SUCCESS,
                }),
              );
            }),
            catchError((err: HttpErrorResponse) => {
              const e = err?.error;
              this.displayNotification.displayNotification(
                new Notification({ title: e?.title, content: e?.description, type: NotificationType.ERROR }),
              );
              return of();
            }),
            take(1),
          )
          .subscribe();
      },
    });
  }

  private buildCampaignDraftQuery({ tableState, filters }): string {
    const { page, limit, searchTerm, sortColumn, sortDirection } = tableState;
    const { adAccounts } = filters;
    const query = RequestQueryBuilder.create();
    query.setLimit(limit).setPage(page);
    if (sortColumn && sortDirection) {
      query.sortBy({ field: sortColumn, order: sortDirection.toUpperCase() });
    }
    query.sortBy({ field: 'updatedAt', order: 'DESC' });
    if (searchTerm) {
      query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm });
    }
    query.setFilter({
      field: 'adAccount.id',
      operator: CondOperator.IN,
      value:
        adAccounts
          .filter((adAccount) => adAccount.checked)
          .map((adAccount) => adAccount.id)
          .join(',') || '38f0cda2-008b-417e-bf68-1a355ecc3e54', // ! hack,,
    });
    return query.query();
  }
}
