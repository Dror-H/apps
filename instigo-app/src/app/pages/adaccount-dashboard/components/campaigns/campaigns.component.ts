import { Component, Input, OnChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { getTimeQueryParams } from '@app/global/get-time-query-params';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { DataTableComponent } from '@app/shared/data-table/data-table/data-table.component';
import { AdAccountDTO, DateTimeInterval, getConversionRelatedFields } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-campings-table',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
})
export class CampaignsTableComponent implements OnChanges {
  @ViewChild(DataTableTemplatesComponent, { static: true })
  templates: DataTableTemplatesComponent;

  @ViewChild(DataTableComponent, { static: true })
  dataTableComponent: DataTableComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  public searchTermTemplateAndSelect: TemplateRef<any>;

  @Input() adAccount: AdAccountDTO;
  @Input() dateRange: DateTimeInterval;

  public tableConfiguration: TableConfiguration;
  public tableData: Array<any>;
  public tableState: TableState;

  constructor(private readonly campaignApiService: CampaignApiService, private router: Router) {
    this.tableState = new TableState();
  }

  ngOnChanges(): void {
    this.tableConfiguration = this.getTableConfiguration();
    if (this.adAccount !== null) {
      this.onTableStateChange(this.tableState);
    }
  }

  public selectCampaign(campaign: any) {
    this.router.navigate(['/campaign-details', campaign.id], { queryParams: { provider: campaign.provider } });
  }

  public onTableStateChange(state) {
    this.campaignApiService
      .insights({ query: this.getQuery(state) })
      .pipe(
        take(1),
        tap((response) => {
          this.tableState.page = response.page || this.tableState.page;
          this.tableState.totalRecords = response.total || 0;
        }),
        map((campaignsList) => campaignsList.data),
        map((campaigns) =>
          campaigns?.length
            ? campaigns.map((campaign) => {
                const conversionsRelated = getConversionRelatedFields(
                  campaign?.insights?.summary,
                  campaign.actionTypeField,
                );
                return {
                  currency: campaign.adAccount.currency,
                  ...campaign,
                  ...campaign.insights.summary,
                  ...conversionsRelated,
                };
              })
            : [],
        ),
      )
      .subscribe((campaignsList) => {
        this.tableData = campaignsList;
      });
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: true,
      tableId: `dashboard_campaigns_table_${this.adAccount?.id}`,
      columns: [
        {
          name: 'Name',
          prop: 'name',
          unhideable: true,
          cellTemplate: this.searchTermTemplateAndSelect,
          frozenLeft: true,
          width: 300,
        },
        {
          name: 'Status',
          prop: 'status',
          cellTemplate: this.templates?.campaignStatus,
          canAutoResize: false,
          unhideable: true,
          width: 100,
        },
        {
          name: 'Budget',
          prop: 'budget',
          cellTemplate: this.templates?.campaignBudgetTemplate,
          canAutoResize: false,
          width: 180,
        },
        {
          name: 'Objective',
          prop: 'objective',
          canAutoResize: false,
          cellTemplate: this.templates.startCase,
          width: 180,
        },
        {
          name: 'Spend',
          prop: 'spend',
          sortable: false,
          cellTemplate: this.templates?.currencyCell,
          width: 150,
        },
        {
          name: 'Impressions',
          prop: 'impressions',
          sortable: false,
          cellTemplate: this.templates?.numberCell,
          width: 150,
        },
        {
          name: 'Clicks',
          prop: 'clicks',
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
      ],
      selectable: false,
      searchable: true,
      columnsCustomizable: true,
      clientSide: false,
    };
  }

  private getQuery(state?) {
    const { page, limit, searchTerm, sortColumn, sortDirection } = state;
    const qb = RequestQueryBuilder.create();
    const query = qb.setLimit(limit).setPage(page);
    query.setFilter({
      field: 'adAccount.id',
      operator: CondOperator.EQUALS,
      value: this.adAccount?.id,
    });
    if (sortColumn && sortDirection) {
      query.sortBy({ field: sortColumn, order: sortDirection.toUpperCase() });
    } else {
      query.sortBy({ field: 'createdAt', order: 'DESC' });
    }
    if (searchTerm) {
      query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm });
    }
    return `${query.query()}&${getTimeQueryParams({
      dateRange: this.dateRange?.dateRange,
    })}&provider_parameters={ "fields": ["social_spend", "actions"] }`;
  }
}
