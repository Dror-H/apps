import { ProviderList } from './provider';

export const providerListSelectionConfig: ProviderList = {
  config: { selectedColumns: ['email', 'phone', 'remove me column'] },
  tableConfiguration: {
    scrollbarH: true,
    tableId: `facebook_audience_table`,
    columns: [
      { name: 'email', prop: 'email' },
      { name: 'phone', prop: 'phone' },
      { name: 'remove me column', prop: 'remove me column' },
    ],
    selectable: false,
    columnsCustomizable: false,
    clientSide: true,
    searchable: false,
    matches: () => true,
  },
  tableState: {},
  tableData: [],
};

export const providerListMapColumnConfig: ProviderList = {
  config: { selectedColumns: ['email', 'phone', 'map me'] },
  tableConfiguration: {
    scrollbarH: true,
    tableId: `facebook_audience_table`,
    columns: [
      { name: 'email', prop: 'email' },
      { name: 'phone', prop: 'phone' },
      { name: 'map me', prop: 'map me' },
    ],
    selectable: false,
    columnsCustomizable: false,
    clientSide: true,
    searchable: false,
    matches: () => true,
  },
  tableState: {},
  tableData: [],
};
