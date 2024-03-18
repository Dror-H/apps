import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Resources } from '@instigo-app/data-transfer-object';

@Injectable()
export class UploadUtilityApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.UTILITY_UPLOADS);
  }

  download(options: { filePath: string }): Observable<any> {
    const { filePath } = options;
    return this.httpClient
      .get(`server/${Resources.UTILITY_UPLOADS}/download?filePath=${filePath}`, {
        responseType: 'blob',
      })
      .pipe(take(1));
  }
}
