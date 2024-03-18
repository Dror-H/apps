import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { TableConfiguration, TableState } from '../data-table.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent implements OnInit, OnChanges {
  cachedTableData: Array<any> = [];
  @Input() tableConfiguration: TableConfiguration;
  @Input() state: TableState;
  @Input() tableData: Array<any>;
  @Output() columnsChange = new EventEmitter<any[]>();
  @Output() stateChange = new EventEmitter<Partial<TableState>>();
  scrollX: string | null = null;
  responsiveColClass: string | null = null;

  setOfSelectedItems = new Set<any>();

  constructor() {}

  ngOnInit(): void {
    this.scrollX = this.tableConfiguration.scrollbarH ? '100vw' : null;
    if (this.tableConfiguration.clientSide) {
      this.cachedTableData = [...(this.tableData || [])];
    }
    if (this.tableConfiguration.responsiveCol) {
      const columnNum = this.tableConfiguration.responsiveCol.column;
      const maxWidth = this.tableConfiguration.responsiveCol.maxWidth;
      this.responsiveColClass = `responsive-col-${columnNum}-${maxWidth}`;
      if (this.tableConfiguration.responsiveCol.hasIcon) {
        this.responsiveColClass += ` responsive-col-${columnNum}-has-icon`;
      }
    }
    this.checkScreenSize();
    this.setFooterText();
  }

  isChecked(data: any): boolean {
    const fieldIdentifier = this.tableConfiguration.fieldIdentifier || 'id';
    const findFunction = (item) => item?.[fieldIdentifier] === data?.[fieldIdentifier];
    return !!([...this.setOfSelectedItems].find(findFunction) || data?.isSelected || data?.checked);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { state } = changes;
    if (state?.currentValue?.selectedItems.length !== 0) {
      state?.currentValue?.selectedItems.forEach((item) => this.setOfSelectedItems.add(item));
    }
    if (state?.currentValue?.selectedItems.length === 0) {
      this.setOfSelectedItems.clear();
    }
    if (changes?.tableData) {
      this.cachedTableData = [...(this.tableData || [])];
    }
    this.setFooterText();
  }

  public onSearch(searchTerm: string) {
    this.state.searchTerm = searchTerm;
    this.state.page = 1;
    if (this.tableConfiguration.clientSide) {
      this.clientSideSortingSearchPagination();
    } else {
      this.state.selectedItems = [];
      this.stateChange.emit(this.state);
    }
  }

  public onSort({ prop, direction }) {
    if (direction) {
      this.state.sortColumn = prop.split('.')[prop.split('.').length - 1];
      this.state.sortDirection = direction === 'ascend' ? 'desc' : 'asc';
      this.state.page = 1;
      if (this.tableConfiguration.clientSide) {
        this.clientSideSortingSearchPagination();
      } else {
        this.state.selectedItems = [];
        this.stateChange.emit(this.state);
      }
    }
  }

  public onSelect(selected) {
    const fieldIdentifier = this.tableConfiguration.fieldIdentifier || 'id';
    const findFunction = (item) => item?.[fieldIdentifier] === selected?.[fieldIdentifier];
    const found = [...this.setOfSelectedItems].find(findFunction);
    if (found) {
      this.setOfSelectedItems.delete(found);
    } else {
      this.setOfSelectedItems.add(selected);
    }
    this.state.selectedItems = [...Array.from(this.setOfSelectedItems)];
    this.stateChange.emit({ selectedItems: Array.from(this.setOfSelectedItems) });
  }

  public onSelectAllRows(allRowsSelected) {
    this.state.allRowsSelected = !!allRowsSelected;
    if (allRowsSelected) {
      this.state.selectedItems = [...(this.cachedTableData || this.tableData)].filter((row) => row.disabled !== true);
      this.state.selectedItems.forEach((item) => this.setOfSelectedItems.add(item));
    } else {
      this.state.selectedItems = [];
      this.setOfSelectedItems.clear();
    }
    this.stateChange.emit({ allRowsSelected: this.state.allRowsSelected, selectedItems: this.state.selectedItems });
  }

  public onPageChange($event) {
    this.state.page = $event;
    this.setFooterText();
    if (this.tableConfiguration.clientSide) {
      this.clientSideSortingSearchPagination();
    } else {
      this.state.selectedItems = [];
      this.stateChange.emit(this.state);
    }
  }

  public onPageSizeChange() {
    this.setFooterText();
    if (this.tableConfiguration.clientSide) {
      this.clientSideSortingSearchPagination();
    } else {
      this.state.selectedItems = [];
      this.stateChange.emit(this.state);
    }
  }

  public onColumnsChange(columns: any[]) {
    this.columnsChange.emit(columns);
  }

  private setFooterText() {
    const { limit, page } = this.state;
    this.state.startIndex = (page - 1) * limit + 1;
    this.state.endIndex = (page - 1) * limit + limit;
    if (this.state.endIndex > this.state.totalRecords) {
      this.state.endIndex = this.state.totalRecords;
    }
  }

  private clientSideSortingSearchPagination() {
    const dataTable = this.sortTable(this.cachedTableData, this.state.sortColumn, this.state.sortDirection);
    const filteredData = dataTable.filter((table) => this.tableConfiguration.matches(table, this.state.searchTerm));
    let data = filteredData;
    this.state.totalRecords = filteredData.length;
    this.setFooterText();
    data = data.slice(this.state.startIndex - 1, this.state.endIndex + 1);
    this.tableData = data;
  }

  private sortTable(tables: any[], column: string, direction: string): any[] {
    const compare = (v1, v2) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);
    if (direction === '') {
      return tables;
    } else {
      return [...tables].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private checkScreenSize() {
    const mobileView = 768;
    const screenWidth = window.innerWidth;
    if (screenWidth < mobileView) {
      this.tableConfiguration.scrollbarH = true;
    }
  }
}
