import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resources } from '@instigo-app/data-transfer-object';
import { take } from 'rxjs/operators';

@Injectable()
export class ReportsApiService {
  constructor(protected httpClient: HttpClient) {}

  createAdAccountReport({ payload }) {
    return this.httpClient.post(`server/${Resources.REPORTS}/${Resources.AD_ACCOUNTS}`, payload).pipe(take(1));
  }
}
