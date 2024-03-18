import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { ObservableLoadingInterface } from '@instigo-app/data-transfer-object';
import { AdAccountStatusType } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { WorkspaceState } from '../../../state/workspace.state';
import { WorkspaceDashboardService } from '../../workspace-dashboard.service';

@Component({
  selector: 'ingo-workspace-widget-ad-accounts-table',
  templateUrl: './ad-accounts-table.component.html',
  styleUrls: ['./ad-accounts-table.component.scss'],
})
export class AdAccountsTableComponent implements OnInit {
  @SelectSnapshot(WorkspaceState.workspaceId)
  public workspaceId: Observable<string>;

  @ViewChild('adAccountNameTemplate', { static: true })
  public adAccountNameTemplate: TemplateRef<any>;

  @Input()
  public adAccounts$: Observable<ObservableLoadingInterface<any[]>>;

  public internalDatePresets;
  public tableConfiguration: TableConfiguration;
  public tableState = new TableState({ limit: 7 });
  adAccountStatusType = AdAccountStatusType;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  constructor(private router: Router, private service: WorkspaceDashboardService) {}

  ngOnInit(): void {
    this.internalDatePresets = this.service.datePresets;
    this.tableConfiguration = this.getTableConfiguration();
  }

  updateLength(adAccounts) {
    this.tableState = { ...this.tableState, totalRecords: adAccounts?.length, page: 1 };
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: true,
      tableId: `adAccounts-workspace-dashboard`,
      selectable: false,
      searchable: false,
      columnsCustomizable: false,
      clientSide: true,
      matches: this.matches,
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates?.cellProviderIcon,
          headerTemplate: this.templates?.networkHeader,
          unhideable: true,
          canAutoResize: false,
          frozenLeft: true,
          width: 40,
        },
        {
          name: 'Account',
          prop: 'name',
          unhideable: true,
          frozenLeft: true,
          sortable: true,
          cellTemplate: this.adAccountNameTemplate,
          width: 150,
        },
        {
          name: 'Active Campaigns',
          prop: 'activeCampaigns',
          cellTemplate: this.templates?.numberCell,
          sortable: true,
          width: 110,
        },
        {
          name: 'Total Campaigns',
          prop: 'totalCampaigns',
          sortable: true,
          cellTemplate: this.templates?.numberCell,
          width: 110,
        },
        {
          name: 'Spend',
          prop: 'insights.summary.spend',
          cellTemplate: this.templates?.currencyCell,
          width: 90,
        },
        {
          name: 'Impressions',
          prop: 'insights.summary.impressions',
          cellTemplate: this.templates?.numberCell,
          width: 90,
          sortable: false,
        },
        {
          name: 'Reach',
          prop: 'insights.summary.reach',
          cellTemplate: this.templates?.numberCell,
          width: 90,
          sortable: false,
        },
        {
          name: 'Clicks',
          prop: 'insights.summary.clicks',
          cellTemplate: this.templates?.numberCell,
          width: 90,
          sortable: false,
        },
        {
          name: 'Frequency',
          prop: 'insights.summary.frequency',
          cellTemplate: this.templates?.numberCell,
          width: 80,
          sortable: false,
        },
        {
          name: 'CPM',
          prop: 'insights.summary.cpm',
          cellTemplate: this.templates?.currencyCell,
          width: 70,
        },
        {
          name: 'CPP',
          prop: 'insights.summary.cpp',
          cellTemplate: this.templates?.currencyCell,
          width: 70,
        },
        {
          name: 'CPC',
          prop: 'insights.summary.cpc',
          cellTemplate: this.templates?.currencyCell,
          width: 70,
        },
        {
          name: 'CTR',
          prop: 'insights.summary.ctr',
          sortable: false,
          cellTemplate: this.templates.percentageCell,
          width: 70,
        },
      ],
    };
  }

  private matches(dataTable: any, term: string) {
    return dataTable.name?.toLowerCase().includes(term.toLowerCase());
  }

  public changeRange(timeframe: any) {
    this.service.currentDatePreset$.next(timeframe);
  }

  public isActiveRange(label) {
    return label === this.service.currentDatePreset$.value.value;
  }

  public navigate() {
    this.router.navigate(['/account-control/workspaces/details', this.workspaceId]);
  }
}
