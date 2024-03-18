import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { providerIcons } from '@app/global/constants';
import { generateLookalikeAudienceName } from '@app/global/utils';
import { DataTableTemplatesComponent } from '@app/shared/data-table/cell-template/data-table-templates.component';
import { DataTableColumnConfig, TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';
import { DataTableComponent } from '@app/shared/data-table/data-table/data-table.component';
import { convertAudienceRulesToText } from '@app/shared/shared/convert-audience-rules-to-text';
import {
  AudienceSubType,
  AudienceType,
  FacebookAudienceFields,
  LinkedinAudienceCompanyFields,
  LinkedinAudienceUserFields,
  SupportedProviders,
  UNKNOWN_AUDIENCE_LIST_FIELD,
} from '@instigo-app/data-transfer-object';
import { cloneDeep } from 'lodash-es';
import { ProviderList, ProviderRules } from './provider';

@Component({
  selector: 'app-audience-overview',
  templateUrl: './audience-overview.component.html',
  styleUrls: ['./audience-overview.component.scss'],
})
export class AudienceOverviewComponent implements OnInit {
  @Input()
  audienceForm: FormGroup;

  @Output()
  createAudience = new EventEmitter<void>();

  @Output()
  setStep = new EventEmitter<number>();

  @ViewChild(DataTableComponent, { static: true })
  dataTableComponent: DataTableComponent;

  @ViewChild(DataTableTemplatesComponent, { static: false })
  dataTableTemplates: DataTableTemplatesComponent;

  public AudienceType = AudienceType;
  public AudienceSubType = AudienceSubType;
  public SupportedProviders = SupportedProviders;

  public faFacebookF = providerIcons.facebook;
  public faLinkedinIn = providerIcons.linkedin;
  public providersRules: ProviderRules;
  public providersList: ProviderList;
  public providersLookalikes;

  public get rules(): FormControl {
    return this.audienceForm.controls.target as FormControl;
  }

  ngOnInit(): void {
    const provider = this.audienceForm.controls.provider.value;

    if (this.audienceForm.controls.audienceType.value === AudienceType.CUSTOM_AUDIENCE) {
      if (this.audienceForm.controls.audienceSubType.value === AudienceSubType.WEBSITE) {
        this.providersRules = {
          include: this.convertRulesToText('include'),
          exclude: this.convertRulesToText('exclude'),
        };
      } else if (this.audienceForm.controls.audienceSubType.value === AudienceSubType.LIST) {
        setTimeout(() => {
          this.providersList = {
            tableConfiguration: {} as TableConfiguration,
            tableState: new TableState(),
            tableData: null,
            config: {},
            exportedCount: 0,
            unExportedCount: 0,
          };
          this.providersList.tableData = this.getProviderTableData$(provider);
        });
      }
    } else if (this.audienceForm.controls.audienceType.value === AudienceType.LOOKALIKE_AUDIENCE) {
      this.providersLookalikes = this.buildLookalikeAudiences(provider);
    }
  }

  public onTableStateChange(provider: SupportedProviders, state: Partial<TableState>): void {
    this.providersList.tableState = cloneDeep(state);
  }

  public onColumnChange(
    provider: SupportedProviders,
    event: { column: any; field?: string; selectedColumns?: string[] },
  ): void {
    const { column, field, selectedColumns } = event;
    const customAudienceList = this.audienceForm.controls.target.value;
    if (selectedColumns) {
      customAudienceList.fieldsSelection = selectedColumns;
      this.providersList.config.selectedColumns = selectedColumns;
    } else if (field) {
      this.onTableFieldChange(column, field);
    }
  }

  private updateFieldsSelection(column: any, field: string) {
    const customAudienceList = this.audienceForm.controls.target.value;
    const fieldSelectedIndex = customAudienceList.fieldsSelection.indexOf(column.name);
    if (fieldSelectedIndex !== -1) {
      customAudienceList.fieldsSelection.splice(fieldSelectedIndex, 1, field);
    }
  }

  private updateProvidersListFieldsSelection(column: any, field: string) {
    const selectedColumnIndex = this.providersList.config.selectedColumns.indexOf(column.name);
    if (selectedColumnIndex !== -1) {
      this.providersList.config.selectedColumns.splice(selectedColumnIndex, 1, field);
    }
  }

  private updateAvailableColumns(fields: string[]) {
    this.providersList.config.availableColumns = FacebookAudienceFields.filter((f) => !fields.includes(f));
  }

  private onTableFieldChange(column: any, field: string) {
    const customAudienceList = this.audienceForm.controls.target.value;
    const { fields } = customAudienceList;
    const columnIndex = fields.indexOf(column.name);
    fields.splice(columnIndex, 1, field);
    this.updateFieldsSelection(column, field);
    this.updateProvidersListFieldsSelection(column, field);
    this.updateAvailableColumns(fields);
    column.name = field; // used for previous mapped field
  }

  private setTableState(provider: SupportedProviders, tableData: any[], currentState?: Partial<TableState>): void {
    const tableState = {
      page: 1,
      limit: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
      startIndex: 1,
      endIndex: 0,
      totalRecords: tableData.length,
      selectedItems: [],
      allRowsSelected: false,
    };
    this.onTableStateChange(provider, tableState);
  }

  private getProviderTableData$(provider: SupportedProviders): any[] {
    const { content, fields, fieldsSelection } = this.rules.value;
    this.checkProviderListOptions(provider, fields, fieldsSelection);
    this.updateProviderListCounts(fields, fieldsSelection);
    this.providersList.tableConfiguration = this.getProviderTableConfiguration(provider, fields);
    const tableData = !fields.length ? [] : this.getProviderTableData(fields, content);
    this.setTableState(provider, tableData, this.providersList.tableState);
    return tableData;
  }

  private checkProviderListOptions(provider: SupportedProviders, fields: string[], fieldsSelection: string[]): void {
    const listHasChanged =
      JSON.stringify(fieldsSelection) !== JSON.stringify(this.providersList.config.selectedColumns);

    const providerColumns = this.getProviderColumns(provider, fields);
    if (!Object.keys(this.providersList.config).length || listHasChanged) {
      this.providersList.config = {
        options: providerColumns,
        columnIsValid: (column) => this.fieldIsValid(column.name),
        selectedColumns: fields,
        availableColumns: providerColumns.map(({ value }) => value).filter((f) => !fields.includes(f)),
      };
    }
  }

  private updateProviderListCounts(fields: string[], fieldsSelection: string[]): void {
    const filteredFields = this.getValidAndSelectedFields(fields, fieldsSelection);
    this.providersList.exportedCount = filteredFields.length;
    this.providersList.unExportedCount = fields.length - filteredFields.length;
  }

  private getProviderTableConfiguration(provider: SupportedProviders, fields: string[]): TableConfiguration {
    return {
      scrollbarH: true,
      tableId: `${provider}_audience_table`,
      columns: fields.map((field) => this.getTableColumn(field)),
      selectable: false,
      columnsCustomizable: false,
      clientSide: true,
      searchable: false,
      matches: () => true,
    };
  }

  private getTableColumn(field: string): DataTableColumnConfig {
    const column: DataTableColumnConfig = {
      name: field,
      prop: field,
      unhideable: false,
      sortable: false,
      canAutoResize: true,
      headerTemplate: this.dataTableTemplates?.selectableTemplate,
    };
    const smallCellFields = ['country'];
    const largeCellFields = [
      'email',
      'jobtitle',
      'employeecompany',
      'companyname',
      'companywebsite',
      'companyemaildomain',
      'linkedincompanypageurl',
      'industry',
    ];
    if (largeCellFields.some((f) => field.startsWith(f))) {
      column.width = 250;
    } else if (smallCellFields.some((f) => field.startsWith(f))) {
      column.width = 200;
    } else {
      column.width = 200;
    }
    return column;
  }

  private getProviderTableData(fields: string[], content: any[]): any[] {
    return content.map((row: any[]) => row.reduce((acc, curr, index) => ({ ...acc, [fields[index]]: curr }), {}));
  }

  private getProviderColumns(provider: SupportedProviders, fields: string[]): any[] {
    if (provider === SupportedProviders.FACEBOOK) {
      return FacebookAudienceFields.map((field) => ({ name: field, value: field }));
    }
    if (
      provider === SupportedProviders.LINKEDIN &&
      LinkedinAudienceCompanyFields.some((field) => fields.includes(field))
    ) {
      return LinkedinAudienceCompanyFields.map((field) => ({ name: field, value: field }));
    }
    if (
      provider === SupportedProviders.LINKEDIN &&
      LinkedinAudienceUserFields.some((field) => fields.includes(field))
    ) {
      return LinkedinAudienceUserFields.map((field) => ({ name: field, value: field }));
    }
    return [];
  }

  private getValidAndSelectedFields(fields: string[], columnsSelection: string[]): string[] {
    return fields.filter((f) => this.fieldIsValid(f) && columnsSelection.includes(f));
  }

  private fieldIsValid(field: string): boolean {
    return !field.includes(UNKNOWN_AUDIENCE_LIST_FIELD);
  }

  private convertRulesToText(scope: 'include' | 'exclude'): string {
    if (this.rules.value[scope]) {
      return convertAudienceRulesToText(this.rules.value, scope);
    } else {
      return null;
    }
  }

  private buildLookalikeAudiences(provider: SupportedProviders): any {
    const lookalikesList = this.audienceForm.controls.target.value['lookalikeSpecsList'][provider];
    return lookalikesList.list.map((item, index) =>
      generateLookalikeAudienceName(item, index, lookalikesList, this.audienceForm.value.name),
    );
  }
}
