import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { DataTableComponent } from '@app/shared/data-table/data-table/data-table.component';
import { AdAccountDTO, AvailableAdAccountsDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-ad-account-select',
  templateUrl: './ad-account-select.component.html',
  styleUrls: ['./ad-account-select.component.scss'],
})
export class AdAccountSelectComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableComponent, { static: false }) dataTableComponent: DataTableComponent;
  @ViewChild(DataTableTemplatesComponent, { static: true }) templates: DataTableTemplatesComponent;
  @Input() provider: SupportedProviders;

  public tableConfiguration: TableConfiguration;
  public tableData: AdAccountDTO[];
  public isLoading = true;
  public tableState = new TableState({ limit: 10 });
  public searchTerm$ = new BehaviorSubject<any>('');

  private subscription = new SubSink();

  constructor(
    private modal: NzModalRef,
    private adAccountApiService: AdAccountApiService,
    private displayNotification: DisplayNotification,
  ) {}

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.adAccountApiService.getAvailableAdAccounts({ provider: this.provider }).subscribe(
      (adAccounts: AvailableAdAccountsDTO[]) => {
        this.tableData = adAccounts.map((adAccount) => ({
          ...adAccount,
          disabled: adAccount.used ? true : null,
          isSelected: adAccount.used ? true : null,
        }));
        this.tableState.totalRecords = this.tableData.length;
        this.isLoading = false;
      },
      (error) => {
        this.modal.destroy(error);
        this.displayNotification.displayNotification(
          new Notification({
            titleId: `app.onboarding.getAdAccountsError`,
            type: NotificationType.ERROR,
          }),
        );
      },
    );
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public closeModal() {
    this.modal.destroy();
  }

  public saveSelectedAccount() {
    this.modal.close(this.tableState.selectedItems);
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      fieldIdentifier: 'providerId',
      tableId: `select_adAccounts_table`,
      customActions: [],
      quickActions: [],
      columns: [
        {
          name: 'Name',
          prop: 'name',
          cellTemplate: this.templates.searchTermTemplate,
        },
        {
          name: 'Business Name',
          prop: 'businessName',
          cellTemplate: this.templates.businessTemplate,
        },
        {
          name: 'Instigo Workspace',
          prop: 'workspace.name',
          cellTemplate: this.templates.nameTemplate,
        },
      ],
      selectable: true,
      columnsCustomizable: false,
      clientSide: true,
      searchable: false,
      matches: (dataTable: any, term: string): boolean =>
        dataTable.name.toLowerCase().includes(term.toLowerCase()) ||
        dataTable.businessName.toLowerCase().includes(term.toLowerCase()),
    };
  }
}
