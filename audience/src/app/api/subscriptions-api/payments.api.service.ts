import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resources } from '@instigo-app/data-transfer-object';
import { CrudService, PaymentsApiServiceInterface } from '@instigo-app/ui/shared';

@Injectable({
  providedIn: 'root',
})
export class PaymentsApiService extends CrudService<any, string> implements PaymentsApiServiceInterface {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.PAYMENTS);
  }
}
