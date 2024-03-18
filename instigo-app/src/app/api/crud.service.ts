import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface CrudOperations<T, ID> {
  create(options: { payload: Partial<T> }): Observable<T>;
  bulkCreate(options: { payload: [Partial<T>] }): Observable<T[]>;
  bulkUpdate(options: { payload: [Partial<T>] }): Observable<T[]>;
  update(options: { id: ID; payload: Partial<T> }): Observable<T>;
  replace(options: { id: ID; payload: Partial<T> }): Observable<T>;
  findOne(options: { id: ID }): Observable<T>;
  findAll(query?: string): Observable<T[]>;
  delete(options: { id: ID }): Observable<any>;
}

export abstract class CrudService<T, ID> implements CrudOperations<T, ID> {
  protected constructor(protected httpClient: HttpClient, protected base: string, protected entity: string) {}

  create(options: { payload: Partial<T> }): Observable<T> {
    const { payload } = options;
    return this.httpClient.post<T>(`${this.base}/${this.entity}`, payload);
  }

  bulkCreate(options: { payload: Partial<T>[] }): Observable<T[]> {
    const { payload } = options;
    return this.httpClient.post<T[]>(`${this.base}/${this.entity}/bulk`, { bulk: payload });
  }

  bulkUpdate(options: { payload: Partial<T>[] }): Observable<T[]> {
    const { payload } = options;
    return this.httpClient.patch<T[]>(`${this.base}/${this.entity}/bulk`, { bulk: payload });
  }

  update(options: { id: ID; payload: Partial<T>; currentWorkspace?: string }): Observable<any> {
    const { id, payload, currentWorkspace } = options;
    return this.httpClient.patch<T>(`${this.base}/${this.entity}/${id}`, payload, {
      headers: {
        ...(currentWorkspace && { 'current-workspace': currentWorkspace }),
      },
    });
  }

  replace(options: { id: ID; payload: T }): Observable<any> {
    const { id, payload } = options;
    return this.httpClient.put<T>(`${this.base}/${this.entity}/${id}`, payload, {});
  }

  findOne(options: { id: ID }): Observable<any> {
    const { id } = options;
    return this.httpClient.get<T>(`${this.base}/${this.entity}/${id}`);
  }

  findAll(query = ''): Observable<any> {
    return this.httpClient.get<any>(`${this.base}/${this.entity}?${query}`);
  }

  insights(options: { query: string }): Observable<any> {
    const { query } = options;
    return this.httpClient.get<any>(`${this.base}/insights/${this.entity}?${query || ''}`);
  }

  tableInsights(options: { query: string }): Observable<any> {
    const { query } = options;
    return this.httpClient.get<any>(`${this.base}/insights/table/${this.entity}?${query || ''}`);
  }

  delete(options: { id: ID; currentWorkspace?: string }): Observable<any> {
    const { id, currentWorkspace } = options;
    return this.httpClient.delete<T>(`${this.base}/${this.entity}/${id}`, {
      headers: {
        ...(currentWorkspace && { 'current-workspace': currentWorkspace }),
      },
    });
  }
}
