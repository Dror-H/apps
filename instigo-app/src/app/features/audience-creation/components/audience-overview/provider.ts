import { TableConfiguration, TableState } from '@app/shared/data-table/data-table.model';

export interface ProviderRules {
  include: string;
  exclude?: string;
}

export interface ProviderList {
  tableConfiguration: TableConfiguration;
  tableData: any[];
  tableState: Partial<TableState>;
  config?: {
    options?: { name: string; value: any }[];
    selectedColumns?: string[];
    availableColumns?: string[];
    columnIsValid?: (column: any) => boolean;
  };
  exportedCount?: number;
  unExportedCount?: number;
}
