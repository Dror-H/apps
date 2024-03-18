import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { CreateLeadFormModalComponent } from './create-lead-form-modal/create-lead-form-modal.component';
import { LeadgenFormService } from './leadgen-form.service';

@Component({
  selector: 'ingo-leadgen-form',
  templateUrl: './leadgen-form.component.html',
  providers: [LeadgenFormService],
})
export class LeadgenFormComponent implements OnInit {
  public tableState$: Observable<TableState>;
  public tableData: Observable<any[]>;
  public tableConfiguration: TableConfiguration;
  public filters$: Observable<any>;

  @ViewChild(DataTableTemplatesComponent, { static: true })
  private templates: DataTableTemplatesComponent;

  @ViewChild('searchTermTemplateAndSelect', { static: true })
  private searchTermTemplateAndSelect: TemplateRef<any>;

  constructor(private leadgenFormService: LeadgenFormService, private readonly modalService: NzModalService) {}

  ngOnInit(): void {
    this.filters$ = this.leadgenFormService.filters$;
    this.tableConfiguration = this.getTableConfiguration();
    this.tableState$ = this.leadgenFormService.leadgenFormTableState$.asObservable();
    this.tableData = this.leadgenFormService.leadgenForms$();
  }

  public updateFilterState(value): void {
    this.leadgenFormService.updateFilters(value);
  }

  public onTableStateChange(state: Partial<TableState>): void {
    this.leadgenFormService.updateLeadgenFormViewTableState(state);
  }

  public create(): void {
    this.modalService.create({
      nzTitle: `Create Lead Form`,
      nzContent: CreateLeadFormModalComponent,
      nzComponentParams: {},
      nzWidth: 500,
    });
  }

  private getTableConfiguration(): TableConfiguration {
    return {
      scrollbarH: false,
      rowIdentity: (row) => row.id,
      tableId: `leadgen_form_view_table`,
      selectable: false,
      searchable: true,
      pageSizeCanBeChanged: true,
      clientSide: false,
      columns: [
        {
          name: 'Form name',
          prop: 'name',
          cellTemplate: this.searchTermTemplateAndSelect,
          width: 200,
        },
        {
          name: 'Provider',
          prop: 'provider',
          cellTemplate: this.templates.cellProviderIcon,
          headerTemplate: this.templates.networkHeader,
          width: 10,
        },
        {
          name: 'Leads',
          prop: 'leadsCount',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: true,
        },
        {
          name: 'Expired leads',
          prop: 'expiredLeadsCount',
          cellTemplate: this.templates?.numberCell,
          width: 150,
          sortable: false,
        },
        {
          name: 'Page',
          prop: 'page.name',
          cellTemplate: this.templates?.nameTemplate,
          width: 150,
          sortable: false,
        },
        {
          name: 'Created',
          prop: 'createdAt',
          sortable: true,
          cellTemplate: this.templates.dateCell,
        },
      ],
    };
  }
}
