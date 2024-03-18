import { distinctUntilKeysChanged } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Observable } from 'rxjs';
import { TableState } from './data-table.model';

export function baseQueryFromTableState({ tableState }): RequestQueryBuilder {
  const { page, limit, searchTerm, sortColumn, sortDirection } = tableState;
  const query = RequestQueryBuilder.create();
  query
    .setLimit(limit)
    .setPage(page)
    .setOffset((page - 1) * limit);
  if (sortColumn && sortDirection) {
    query.sortBy({ field: sortColumn, order: sortDirection.toUpperCase() });
  } else {
    query.sortBy({ field: 'updatedAt', order: 'DESC' });
  }
  if (searchTerm) {
    query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: searchTerm });
  }
  return query;
}

export function tableStateChanges$(state): Observable<TableState> {
  return state.pipe(distinctUntilKeysChanged('page', 'limit', 'offset', 'sortColumn', 'searchTerm', 'sortDirection'));
}
