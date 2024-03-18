import { Injectable, OnDestroy } from '@angular/core';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { TableState } from '@app/shared/data-table/data-table.model';
import { baseQueryFromTableState, tableStateChanges$ } from '@app/shared/data-table/service.helpers';
import { AdTemplateDTO, AdTemplateType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

const defaultsFilter = {
  providers: [
    { label: 'LinkedIn Ads', value: SupportedProviders.LINKEDIN, checked: true },
    { label: 'Facebook Ads', value: SupportedProviders.FACEBOOK, checked: true },
  ],
  adAccounts: [],
  types: [
    {
      label: 'Image',
      value: AdTemplateType.IMAGE,
      icon: 'far fa-images',
      checked: true,
    },
    {
      label: 'Video',
      value: AdTemplateType.VIDEO,
      icon: 'far fa-video',
      checked: true,
    },
    {
      label: 'Carousel',
      value: AdTemplateType.CAROUSEL,
      icon: 'fal fa-conveyor-belt-alt',
      checked: true,
    },
  ],
};

export interface AdTemplatesFilter {
  providers: { label: string; value: SupportedProviders; checked: boolean }[];
  adAccounts: any[];
  types: {
    label: string;
    value: AdTemplateType;
    icon: string;
    checked: boolean;
  }[];
}

@Injectable()
export class AdTemplatePageService implements OnDestroy {
  public adTemplateTableState$ = new BehaviorSubject(new TableState());
  public refresh$ = new BehaviorSubject(null);
  public filters$ = new BehaviorSubject<Partial<any>>(defaultsFilter);
  private subsink = new SubSink();

  constructor(private readonly store: Store, private readonly adTemplateApiService: AdTemplateApiService) {
    this.subsink.sink = this.store.select(WorkspaceState.get).subscribe((workspace) => {
      const adAccounts = workspace.adAccounts
        ? [...workspace.adAccounts.map((adAccount) => ({ ...adAccount, checked: true }))]
        : null;
      this.updateFilters({ adAccounts });
    });
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe();
  }

  public updateFilters(filters: any): void {
    this.filters$.next({ ...this.filters$.value, ...filters });
  }

  public updateTableState(state: Partial<TableState>): void {
    this.adTemplateTableState$.next({ ...this.adTemplateTableState$.value, ...state });
  }

  public adTemplates$(): Observable<AdTemplateDTO[]> {
    const tableState$ = tableStateChanges$(this.adTemplateTableState$);
    const filter$ = this.filters$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.clearSelection()),
    );
    return combineLatest([tableState$, filter$, this.refresh$]).pipe(
      switchMap(([tableState, filters]) => {
        const query = this.buildQuery({ tableState, filters });
        return this.adTemplateApiService.findAll(query).pipe(
          tap((response) => {
            this.updateTableState({ totalRecords: response.total });
          }),
          map((response) => response.data),
          map((adTemplates: any) =>
            adTemplates.map((adTemplate: any) => ({
              id: adTemplate.id,
              name: adTemplate.name,
              thumbnail: adTemplate.data?.picture?.location,
              adTemplateType: adTemplate.adTemplateType,
              updatedAt: adTemplate.updatedAt,
              createdAt: adTemplate.createdAt,
              provider: adTemplate.provider,
              data: adTemplate.data,
              workspace: { id: adTemplate?.workspace?.id },
              adAccount: { id: adTemplate?.adAccount?.id },
            })),
          ),
          catchError((err) => of([])),
        );
      }),
    );
  }

  private clearSelection() {
    this.updateTableState({ allRowsSelected: false, selectedItems: [] });
  }

  private buildQuery({ tableState, filters }): string {
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
      field: 'adTemplateType',
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
