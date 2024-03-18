import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Resources } from '@instigo-app/data-transfer-object';

@Injectable()
export class FileManagerApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.FILES);
  }

  download(options: { id: string }): Observable<any> {
    const { id } = options;
    return this.httpClient
      .get(`server/${Resources.FILES}/download/${id}`, {
        responseType: 'blob',
      })
      .pipe(take(1));
  }
}
