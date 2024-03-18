import { Injectable, OnDestroy } from '@angular/core';
import { LeadgenFormApiService } from '@app/api/services/leadgen-form.api.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { TableState } from '@app/shared/data-table/data-table.model';
import { tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import { AdAccountDTO, LeadgenFormDTO, PageDTO, PageType } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Store } from '@ngxs/store';
import { uniqBy } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

const defaultsFilter = {
  pages: [],
};

@Injectable()
export class LeadgenFormService implements OnDestroy {
  public leadgenFormTableState$ = new BehaviorSubject(
    new TableState({ sortColumn: 'createdAt', sortDirection: 'desc' }),
  );
  public refresh$ = new BehaviorSubject(null);
  public filters$ = new BehaviorSubject<Partial<{ pages: any[] }>>(defaultsFilter);
  private subsink = new SubSink();

  constructor(public leadgenFormServiceApi: LeadgenFormApiService, private readonly store: Store) {
    this.mapAdAccountsAndPagesOfTheWorkspace();
  }

  ngOnDestroy(): void {
    this.leadgenFormTableState$.unsubscribe();
    this.refresh$.unsubscribe();
    this.subsink.unsubscribe();
  }

  public updateFilters(filters: any): void {
    this.filters$.next({ ...this.filters$.value, ...filters });
  }

  public updateLeadgenFormViewTableState(state: Partial<TableState>): void {
    this.leadgenFormTableState$.next({ ...this.leadgenFormTableState$.value, ...state });
  }

  public leadgenForms$(): Observable<LeadgenFormDTO[]> {
    const tableState$ = tableStateChanges$(this.leadgenFormTableState$);
    const filter$ = this.filters$.pipe(debounceTime(400), distinctUntilChanged());
    return combineLatest([tableState$, filter$, this.refresh$.asObservable()]).pipe(
      switchMap(([tableState, filters]) => {
        const query = this.buildLeadgenFormsQuery({ tableState, filters });
        return this.leadgenFormServiceApi.findAll(query).pipe(
          tap((response) => {
            this.updateLeadgenFormViewTableState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((leadForms) => {
            if (leadForms?.length > 0) {
              return leadForms.map((item) => ({ ...item, name: item.name }));
            }
            return [];
          }),
          catchError((err) => of([])),
        );
      }),
    );
  }

  private mapAdAccountsAndPagesOfTheWorkspace() {
    this.subsink.sink = this.store.select(WorkspaceState.get).subscribe((workspace) => {
      const adAccounts = workspace?.adAccounts
        ? [...workspace?.adAccounts.map((adAccount) => ({ ...adAccount, checked: true }))]
        : null;
      const pages = this.extractPagesFromAdAccounts(adAccounts);
      this.updateFilters({ pages });
    });
  }

  private extractPagesFromAdAccounts(adAccounts: AdAccountDTO[]): PageDTO[] {
    let pages: PageDTO[] = [];
    for (const adAccount of adAccounts) {
      pages = adAccount?.pages?.length > 0 ? [...pages, ...adAccount?.pages] : pages;
      pages = pages.filter((page) => page.type === PageType.FACEBOOK);
      pages = pages.map((page) => ({ ...page, checked: true, adAccountProviderId: adAccount.providerId }));
    }
    pages = uniqBy(pages, 'providerId');
    return pages;
  }

  private buildLeadgenFormsQuery({ tableState, filters }): string {
    const { page, limit, sortColumn, sortDirection, searchTerm } = tableState;
    const { pages } = filters;
    const query = RequestQueryBuilder.create();
    query.setLimit(limit).setPage(page);
    if (sortColumn && sortDirection) {
      query.sortBy({ field: sortColumn, order: sortDirection.toUpperCase() });
    }
    if (searchTerm) {
      query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm });
    }
    query.setFilter({
      field: 'page.providerId',
      operator: CondOperator.IN,
      value:
        pages
          .filter((page) => page.checked)
          .map((page) => page.providerId)
          .join(',') || '38f0cda2-008b-417e-bf68-1a355ecc3e54', // ! hack,,
    });

    return query.query();
  }
}
