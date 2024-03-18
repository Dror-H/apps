import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '@app/api/crud.service';
import { Resources } from '@instigo-app/data-transfer-object';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable()
export class ValidatorApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.VALIDATION);
  }

  public isValidUrl(url: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`server/${Resources.VALIDATION}/url`, { url: url }).pipe(take(1));
  }
}
