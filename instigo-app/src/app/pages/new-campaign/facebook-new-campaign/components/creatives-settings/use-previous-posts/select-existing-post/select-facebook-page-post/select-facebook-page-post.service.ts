import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { PostApiService } from '@app/api/services/post.api.service';
import { TableState } from '@app/shared/data-table/data-table.model';
import { tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import { AdAccountDTO, RxStore } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
@Injectable()
export class SelectFacebookPagePostService {
  public postsTableState = new RxStore<TableState>(new TableState({ sortColumn: 'createdAt', sortDirection: 'desc' }));
  public adAccount$ = new BehaviorSubject(null);
  public pageId$ = new BehaviorSubject(null);
  public isPageEngagementCampaignObjective = false;

  constructor(private readonly postApiService: PostApiService, private readonly datePipe: DatePipe) {}

  public existingPosts$(): Observable<any> {
    const tableState$ = tableStateChanges$(this.postsTableState.state$);
    return combineLatest([this.adAccount$, tableState$, this.pageId$]).pipe(
      switchMap(([adAccount, tableState, pageId]) => {
        const query = this.getQuery(adAccount, tableState, pageId);
        return this.postApiService.findAll(query).pipe(
          tap((response) => {
            this.postsTableState.patchState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((posts) =>
            posts?.map((post) => ({
              ...post,
              content: [post.data?.attachments?.title, post.data?.message],
              data: {
                ...post.data,
                fullPicture: post.data?.fullPicture || post.data?.attachments?.media?.image.src,
              },
              disabledItem:
                !post.data.isEligibleForPromotion ||
                (this.isPageEngagementCampaignObjective && !post.data.canBeUseInAds),
              adAccount,
            })),
          ),
          catchError((err) => of([])),
        );
      }),
    );
  }

  private getQuery(adAccount: AdAccountDTO, tableState: TableState, pageId: string): string {
    const query = this.baseQueryFromTableState({ tableState });
    if (pageId) {
      query.setFilter({
        field: 'page.providerId',
        operator: CondOperator.EQUALS,
        value: pageId,
      });
    } else {
      query.setFilter({
        field: 'page.providerId',
        operator: CondOperator.IN,
        value: adAccount.pages.map((page) => page.providerId).join(',') || '38f0cda2-008b-417e-bf68-1a355ecc3e54', // ! hack,,
      });
    }
    return query.query();
  }

  private baseQueryFromTableState({ tableState }): RequestQueryBuilder {
    const { page, limit, searchTerm, sortColumn, sortDirection } = tableState;
    const query = RequestQueryBuilder.create();
    query.setLimit(limit).setPage(page);
    if (sortColumn && sortDirection) {
      query.sortBy({ field: sortColumn, order: sortDirection.toUpperCase() });
    }
    if (searchTerm) {
      query.setFilter({ field: 'message', operator: CondOperator.CONTAINS_LOW, value: searchTerm });
    }
    return query;
  }
}
