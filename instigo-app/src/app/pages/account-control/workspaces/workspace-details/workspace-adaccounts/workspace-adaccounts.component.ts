import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { AdAccountDTO, NotificationType, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { debounceTime, distinctUntilChanged, take, tap } from 'rxjs/operators';
import { DataTableComponent } from '@app/shared/data-table/data-table/data-table.component';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { DisplayNotification, Notification } from '@app/global/display-notification.service';
import { remove } from 'lodash-es';

@Component({
  selector: 'app-workspace-adaccount',
  templateUrl: './workspace-adaccounts.component.html',
  styleUrls: ['./workspace-adaccounts.component.scss'],
})
export class WorkspaceAdAccountsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(DataTableComponent, { static: true })
  dataTableComponent: DataTableComponent;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  dataTableTemplates: DataTableTemplatesComponent;

  @ViewChild('deleteAdAccountActionTemplate', { static: true })
  deleteAdAccountActionTemplate: TemplateRef<any>;

  public tableConfiguration: TableConfiguration;
  public tableData: Array<AdAccountDTO>;
  public tableState = new TableState({ limit: 5 });
  public isSearchOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public searchTerm$ = new Subject<string>();
  @Input()
  workspace: WorkspaceDTO;
  private subscription = new SubSink();

  constructor(private adAccountApiService: AdAccountApiService, private displayNotification: DisplayNotification) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.setTableData();
    this.subscription.sink = this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          if (this.dataTableComponent) this.dataTableComponent?.onSearch(term);
        }),
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.workspace) {
      this.setTableData();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleSearch(): void {
    this.isSearchOpen$.next(!this.isSearchOpen$.value);
  }

  getTableConfiguration(): TableConfiguration {
    return {
      tableId: `workspace_adaccounts_${this.workspace.id}`,
      responsiveCol: {
        column: 4,
        maxWidth: 15,
      },
      selectable: false,
      searchable: false,
      columnsCustomizable: false,
      clientSide: true,
      matches: (dataTable: any, term: string): boolean =>
        dataTable.name.toLowerCase().includes(term.toLowerCase()) ||
        dataTable.businessName.toLowerCase().includes(term.toLowerCase()),
      columns: [
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.dataTableTemplates.cellProviderIcon,
          headerTemplate: this.dataTableTemplates.networkHeader,
          width: 20,
        },
        {
          name: 'Name',
          prop: 'name',
          cellTemplate: this.dataTableTemplates.searchTermTemplate,
          sortable: true,
          width: 260,
        },
        {
          name: 'Business',
          prop: 'businessName',
          cellTemplate: this.dataTableTemplates.searchTermTemplate,
          sortable: true,
          width: 200,
        },
        {
          name: 'Unique ID',
          prop: 'providerId',
          sortable: true,
          width: 200,
        },
        {
          name: 'Disconnect',
          prop: '',
          width: 60,
          cellTemplate: this.deleteAdAccountActionTemplate,
        },
      ],
    };
  }

  deleteAdAccount(adAccount: AdAccountDTO): Subscription {
    return this.adAccountApiService
      .delete({ id: adAccount.id, currentWorkspace: this.workspace.id })
      .pipe(take(1))
      .subscribe(
        () => {
          this.displayNotification.displayNotification(
            new Notification({
              content: 'Ad Account disconnected',
              type: NotificationType.SUCCESS,
            }),
          );
          remove(this.workspace.adAccounts, (eadAccount) => eadAccount.id === adAccount.id);
          this.setTableData();
        },
        (error) => {
          this.displayNotification.displayNotification(
            new Notification({
              content: error.error.message || error.message,
              type: NotificationType.ERROR,
            }),
          );
        },
      );
  }

  setTableData(): void {
    this.tableData = this.workspace.adAccounts.map((account) => ({
      ...account,
      providerId: account.providerId.replace('act_', ''),
    }));
    this.tableState = { ...new TableState({ limit: 5 }), totalRecords: this.tableData.length };
  }
}
