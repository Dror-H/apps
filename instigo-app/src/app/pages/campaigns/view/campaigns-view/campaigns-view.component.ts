import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { CampaignDTO, CampaignStatusType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CampaignsViewService } from '../../campaigns-view.service';
import { QuickActionsService } from '../../quick-actions.service';

@Component({
  selector: 'app-campaigns-view',
  templateUrl: './campaigns-view.component.html',
  styleUrls: ['./campaigns-view.component.scss'],
})
export class CampaignsViewComponent implements OnInit {
  @SelectSnapshot(WorkspaceState.useCachedInsights)
  private useCachedInsights: boolean;

  @SelectSnapshot(WorkspaceState.workspaceId)
  private workspaceId: string;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  public searchTermTemplateAndSelect: TemplateRef<any>;

  @ViewChild('campaignStatusAndActions', { static: true })
  public campaignStatusAndActions: TemplateRef<any>;

  public tableState: Observable<TableState>;
  public tableData: Observable<any[]>;
  public tableConfiguration: TableConfiguration;

  constructor(
    private readonly campaignsViewService: CampaignsViewService,
    private readonly quickActionsService: QuickActionsService,
  ) {}

  ngOnInit() {
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState = this.campaignsViewService.campaignsTableState$.asObservable();
    this.tableData = this.campaignsViewService.campaigns$();
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.campaignsViewService.updateCampaignsViewTableState(state);
  }

  public selectCampaign(campaign: any): void {
    this.campaignsViewService.updateCampaignsViewTableState({ selectedItems: [campaign] });
    if (campaign.provider === SupportedProviders.LINKEDIN) {
      this.campaignsViewService.activeTab$.next(2);
      return;
    }
    this.campaignsViewService.activeTab$.next(1);
  }

  public changeSingleCampaignStatus(campaign: CampaignDTO, newStatus: any) {
    campaign['loading'] = true;
    this.quickActionsService
      .changeCampaignsStatus({
        campaigns: [campaign],
        status: newStatus,
      })
      .pipe(finalize(() => (campaign['loading'] = false)))
      .subscribe();
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: true,
      rowIdentity: (row) => row.id,
      tableId: `campaigns_view_table`,
      selectable: true,
      searchable: true,
      columnsCustomizable: true,
      pageSizeCanBeChanged: true,
      clientSide: false,
      workspaceCachedInsights: !this.useCachedInsights && this.workspaceId,
      quickActions: [
        {
          label: 'Set Active',
          icon: 'far fa-play',
          callback: (items) => {
            this.quickActionsService
              .changeCampaignsStatus({
                campaigns: items,
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
              .changeCampaignsStatus({
                campaigns: items,
                status: CampaignStatusType.PAUSED,
              })
              .subscribe();
          },
        },
        {
          label: 'Delete',
          icon: 'far fa-trash',
          callback: (items) => this.quickActionsService.deleteCampaigns(items),
        },
      ],
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates?.cellProviderIcon,
          headerTemplate: this.templates?.networkHeader,
          unhideable: true,
          sortable: true,
          frozenLeft: true,
          width: 50,
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
          prop: 'ad_account_name',
          cellTemplate: this.templates?.nameTemplate,
          unhideable: true,
          sortable: false,
          width: 230,
        },
        {
          name: 'Status',
          prop: 'status',
          cellTemplate: this.campaignStatusAndActions,
          width: 150,
          sortable: true,
          unhideable: true,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates?.dateCell,
          width: 150,
        },
        {
          name: 'Updated',
          prop: 'updatedAt',
          sortable: true,
          cellTemplate: this.templates?.dateCell,
          width: 150,
        },
        {
          name: 'Budget',
          prop: 'budget',
          cellTemplate: this.templates?.campaignBudgetTemplate,
          width: 180,
        },
        {
          name: 'Ad Sets',
          prop: 'ad_sets_nr',
          sortable: this.useCachedInsights,
          width: 110,
        },
        {
          name: 'Objective',
          prop: 'objective',
          cellTemplate: this.templates?.startCase,
          width: 180,
        },
        {
          name: 'Spend',
          prop: 'spend',
          cellTemplate: this.templates?.currencyCell,
          width: 150,
          sortable: this.useCachedInsights,
        },
        {
          name: 'Impressions',
          prop: 'impressions',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: this.useCachedInsights,
        },
        {
          name: 'Reach',
          prop: 'reach',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: this.useCachedInsights,
        },
        {
          name: 'Clicks',
          prop: 'clicks',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: this.useCachedInsights,
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
          name: 'Frequency',
          prop: 'frequency',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: this.useCachedInsights,
        },
        {
          name: 'Unique Clicks',
          prop: 'unique_clicks',
          cellTemplate: this.templates?.integerCell,
          width: 150,
          sortable: this.useCachedInsights,
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
          cellTemplate: this.templates?.currencyCell,
          sortable: this.useCachedInsights,
          width: 150,
        },
        {
          name: 'CPM',
          prop: 'cpm',
          cellTemplate: this.templates?.currencyCell,
          width: 150,
          sortable: this.useCachedInsights,
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
