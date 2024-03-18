import { TemplateRef } from '@angular/core';

export interface TableConfiguration {
  scrollbarH?: boolean;
  tableId: string;
  quickActions?: TableAction[];
  customActions?: TableAction[];
  columns: Array<DataTableColumnConfig>;
  selectable: boolean;
  columnsCustomizable?: boolean;
  clientSide: boolean;
  pageSizeCanBeChanged?: boolean;
  searchable?: boolean;
  matches?: (...args) => boolean;
  rowIdentity?: (...args) => any;
  fieldIdentifier?: any;
  workspaceCachedInsights?: string;
  /**
   * Defines a responsive column, usually should be the one containing the main data key (e.g. campaign name, audience name).
   * @param column The index of the column to be targeted.
   * @param maxWidth The maximum percentage of the total table width that this column can have. Represented as a number between 1 and 100.
   * @param hasIcon Indicate if there is an action icon floating at the end of the selected column cells
   */
  responsiveCol?: {
    column: number;
    maxWidth: number;
    hasIcon?: boolean;
  };
}

export interface DataTableColumnConfig {
  name: string;
  prop: string;
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: any;
  unhideable?: boolean;
  canAutoResize?: boolean;
  sortable?: boolean;
  pipe?: any;
  frozenLeft?: boolean;
  width?: number;
}

export interface TableAction {
  label?: string;
  icon?: any;
  extraClass?: string;
  divider?: boolean;
  singleSelect?: boolean;
  multipleSelect?: boolean;
  callback?: (...args) => any;
}

export class TableState {
  page: number;
  limit: number;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  sortColumn: string;
  searchTerm: string;
  sortDirection: string;
  selectedItems: Array<any>;
  allRowsSelected: boolean;

  constructor(options?: { limit?: number; sortColumn?: string; sortDirection?: string }) {
    const { limit, sortColumn, sortDirection } = options ?? {};
    this.page = 1;
    this.limit = limit || 10;
    this.searchTerm = '';
    this.sortColumn = sortColumn || '';
    this.sortDirection = sortDirection || '';
    this.startIndex = 1;
    this.endIndex = 0;
    this.totalRecords = 0;
    this.selectedItems = [];
    this.allRowsSelected = false;
  }
}
