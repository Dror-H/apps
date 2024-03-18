import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { AdDTO, CampaignStatusType } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CampaignsViewService } from '../../campaigns-view.service';
import { QuickActionsService } from '../../quick-actions.service';

@Component({
  selector: 'app-ads-view',
  templateUrl: './ads-view.component.html',
  styleUrls: ['./ads-view.component.scss'],
})
export class AdsViewComponent implements OnInit {
  @SelectSnapshot(WorkspaceState.useCachedInsights)
  private useCachedInsights: boolean;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  public searchTermTemplateAndSelect: TemplateRef<any>;

  @ViewChild('adStatusAndActions', { static: true })
  public adStatusAndActions: TemplateRef<any>;

  public tableState: Observable<TableState>;
  public tableData: Observable<any[]>;
  public tableConfiguration: TableConfiguration;

  constructor(
    private readonly campaignsViewService: CampaignsViewService,
    private readonly quickActionsService: QuickActionsService,
  ) {}

  ngOnInit() {
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState = this.campaignsViewService.adsTableState$.asObservable();
    this.tableData = this.campaignsViewService.ads$();
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.campaignsViewService.updateAdsViewTableState(state);
  }

  public changeSingleAdStatus(ad: AdDTO, newStatus: any) {
    ad['loading'] = true;
    this.quickActionsService
      .changeAdStatus({
        ads: [ad],
        status: newStatus,
      })
      .pipe(finalize(() => (ad['loading'] = false)))
      .subscribe();
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: true,
      rowIdentity: (row) => row.id,
      tableId: `ads_table_view`,
      selectable: true,
      searchable: true,
      columnsCustomizable: true,
      pageSizeCanBeChanged: true,
      clientSide: false,
      quickActions: [
        {
          label: 'Set Active',
          icon: 'far fa-play',
          callback: (items) => {
            this.quickActionsService
              .changeAdStatus({
                ads: items,
                status: CampaignStatusType.ACTIVE,
              })
              .subscribe();
          },
        },
        {
          label: 'Set Pause',
          icon: 'far fa-pause',
          callback: (items) => {
            this.quickActionsService
              .changeAdStatus({
                ads: items,
                status: CampaignStatusType.PAUSED,
              })
              .subscribe();
          },
        },
      ],
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates?.cellProviderIcon,
          headerTemplate: this.templates?.networkHeader,
          unhideable: true,
          frozenLeft: true,
          canAutoResize: false,
          width: 50,
        },
        {
          name: 'Media',
          prop: 'thumbnailUrl',
          cellTemplate: this.templates?.thumbnailTemplate,
          unhideable: true,
          frozenLeft: true,
          width: 80,
        },
        {
          name: 'Name',
          prop: 'name',
          cellTemplate: this.searchTermTemplateAndSelect,
          unhideable: true,
          frozenLeft: true,
          width: 300,
        },
        {
          name: 'Status',
          prop: 'status',
          cellTemplate: this.adStatusAndActions,
          canAutoResize: false,
          unhideable: true,
          width: 150,
        },
        {
          name: 'Budget',
          prop: 'budget',
          cellTemplate: this.templates?.currencyCell,
          canAutoResize: false,
          width: 150,
        },
        {
          name: 'Bid Strategy',
          prop: 'bidStrategy',
          canAutoResize: false,
          cellTemplate: this.templates?.startCase,
          unhideable: true,
          width: 200,
        },
        {
          name: 'Spend',
          prop: 'spend',
          sortable: this.useCachedInsights,
          cellTemplate: this.templates?.currencyCell,
          width: 150,
        },
        {
          name: 'Impressions',
          prop: 'impressions',
          cellTemplate: this.templates?.numberCell,
          sortable: this.useCachedInsights,
          width: 150,
        },
        {
          name: 'Clicks',
          prop: 'clicks',
          cellTemplate: this.templates?.numberCell,
          sortable: this.useCachedInsights,
          width: 150,
        },
        {
          name: 'Conversions',
          prop: 'results',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Conversion Rate',
          prop: 'result_rate',
          cellTemplate: this.templates?.percentageCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Reach',
          prop: 'reach',
          cellTemplate: this.templates?.numberCell,
          sortable: this.useCachedInsights,
          width: 150,
        },
        {
          name: 'Unique Clicks',
          prop: 'unique_clicks',
          cellTemplate: this.templates?.integerCell,
          sortable: this.useCachedInsights,
          width: 150,
        },
        {
          name: 'Cost per Unique Click',
          prop: 'cost_per_unique_click',
          cellTemplate: this.templates?.currencyCell,
          sortable: this.useCachedInsights,
          width: 200,
        },
        {
          name: 'CPC',
          prop: 'cpc',
          sortable: this.useCachedInsights,
          cellTemplate: this.templates?.currencyCell,
          width: 150,
        },
        {
          name: 'CPM',
          prop: 'cpm',
          cellTemplate: this.templates?.currencyCell,
          sortable: this.useCachedInsights,
          width: 150,
        },
        {
          name: 'CTR',
          prop: 'ctr',
          sortable: this.useCachedInsights,
          cellTemplate: this.templates?.percentageCell,
          width: 150,
        },
        {
          name: 'CPA',
          prop: 'cpa',
          sortable: false,
          cellTemplate: this.templates?.percentageCell,
          width: 150,
        },
      ],
    };
  }
}
