import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { TableState } from '@app/shared/data-table/data-table.model';
import { baseQueryFromTableState, tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import { AdAccountDTO, AdTemplateDTO } from '@instigo-app/data-transfer-object';
import { CondOperator } from '@nestjsx/crud-request';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class UseExistingTemplateService {
  public adAccount$ = new BehaviorSubject(null);
  public adTemplateTableState$ = new BehaviorSubject(new TableState());

  constructor(private readonly adTemplateApiService: AdTemplateApiService, private readonly datePipe: DatePipe) {}

  public updateTableState(state: Partial<TableState>): void {
    this.adTemplateTableState$.next({ ...this.adTemplateTableState$.value, ...state });
  }

  public adTemplates$(): Observable<AdTemplateDTO[]> {
    const tableState$ = tableStateChanges$(this.adTemplateTableState$);
    return combineLatest([this.adAccount$, tableState$]).pipe(
      switchMap(([adAccount, tableState]) => {
        if (!adAccount) {
          return of([]);
        }
        const query = this.getQuery(adAccount, tableState);
        return this.adTemplateApiService.findAll(query).pipe(
          tap((response) => {
            this.updateTableState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((adTemplates) =>
            adTemplates.map((adTemplate) => ({
              id: adTemplate.id,
              name: adTemplate.name,
              thumbnail: adTemplate.data.pictureUrl,
              adTemplateType: adTemplate.adTemplateType,
              updatedAt: this.datePipe.transform(adTemplate.updatedAt),
              createdAt: this.datePipe.transform(adTemplate.createdAt),
              data: adTemplate.data,
              adAccount: adTemplate.adAccount,
              provider: adTemplate.provider,
              check: false,
              preview: 'adPreview',
            })),
          ),
          catchError((err) => of([])),
        );
      }),
    );
  }

  private getQuery(adAccount: AdAccountDTO, tableState: TableState): string {
    let query = baseQueryFromTableState({ tableState });
    query.setFilter({
      field: 'adAccount.id',
      operator: CondOperator.IN,
      value: adAccount.id,
    });
    query.sortBy({ field: 'createdAt', order: 'DESC' });
    return query.query();
  }
}
