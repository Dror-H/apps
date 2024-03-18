import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { BehaviorSubject } from 'rxjs';
import { WorkspaceDashboardService } from '@app/pages/workspace-dashboard/workspace-dashboard.service';
import { DataTableComponent } from '@app/shared/data-table/data-table/data-table.component';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ingo-workspace-dashboard-campaigns-table',
  templateUrl: './campaigns-table.component.html',
  styleUrls: ['./campaigns-table.component.scss'],
})
export class CampaignsTableComponent implements OnInit, OnDestroy {
  public tableConfiguration: TableConfiguration;
  public tableState$ = new BehaviorSubject<any>(new TableState());
  public isSearchOpen$ = new BehaviorSubject(false);
  public searchTerm$ = new BehaviorSubject<any>('');
  public campaigns$: Observable<any>;

  @ViewChild(DataTableComponent)
  private dataTableComponent: DataTableComponent;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  public searchTermTemplateAndSelect: TemplateRef<any>;

  private subSink = new SubSink();

  toggleSearch() {
    this.isSearchOpen$.next(!this.isSearchOpen$.value);
  }

  constructor(private service: WorkspaceDashboardService, private router: Router) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.subSink.sink = this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          if (this.dataTableComponent) this.dataTableComponent?.onSearch(term);
        }),
      )
      .subscribe();

    this.campaigns$ = this.service.getLatestCampaigns({ state$: this.tableState$ }).pipe(
      tap((response: any) => {
        if (response.value) {
          this.tableState$.next({
            ...this.tableState$.value,
            page: response.value?.page || 1,
            totalRecords: response.value?.total || 0,
          });
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public viewAll() {
    void this.router.navigate(['/campaigns']);
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: true,
      tableId: `campaign-workspace-dashboard`,
      selectable: false,
      searchable: false,
      columnsCustomizable: false,
      clientSide: false,
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates.cellProviderIcon,
          headerTemplate: this.templates.networkHeader,
          unhideable: true,
          sortable: false,
          frozenLeft: true,
          width: 70,
        },
        {
          name: 'Name',
          prop: 'name',
          cellTemplate: this.searchTermTemplateAndSelect,
          unhideable: true,
          frozenLeft: true,
          sortable: true,
          width: 300,
        },
        {
          name: 'Ad Account',
          prop: 'adAccount.name',
          cellTemplate: this.templates.nameTemplate,
          unhideable: true,
          sortable: true,
          width: 230,
        },
        {
          name: 'Status',
          prop: 'status',
          cellTemplate: this.templates?.campaignStatus,
          width: 150,
          sortable: true,
          unhideable: true,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 150,
        },
        {
          name: 'Updated',
          prop: 'updatedAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
          width: 150,
        },
        {
          name: 'Budget',
          prop: 'budget',
          cellTemplate: this.templates.campaignBudgetTemplate,
          width: 180,
        },
        {
          name: 'Ad Sets',
          prop: 'adSetsCount',
          width: 90,
        },
        {
          name: 'Objective',
          prop: 'objective',
          cellTemplate: this.templates.startCase,
          width: 180,
        },
        {
          name: 'Spend',
          prop: 'spend',
          sortable: false,
          cellTemplate: this.templates.currencyCell,
          width: 150,
        },
        {
          name: 'Impressions',
          prop: 'impressions',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Reach',
          prop: 'reach',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Clicks',
          prop: 'clicks',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Conversions',
          prop: 'conversions',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Conversion Rate',
          prop: 'conversionRate',
          cellTemplate: this.templates?.percentageCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Frequency',
          prop: 'frequency',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'CPC',
          prop: 'cpc',
          sortable: false,
          cellTemplate: this.templates.currencyCell,
          width: 150,
        },
        {
          name: 'CPM',
          prop: 'cpm',
          cellTemplate: this.templates.currencyCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'CTR',
          prop: 'ctr',
          sortable: false,
          cellTemplate: this.templates.percentageCell,
          width: 150,
        },
        {
          name: 'CPA',
          prop: 'cpa',
          cellTemplate: this.templates?.currencyCell,
          sortable: false,
          width: 150,
        },
      ],
    };
  }
}
