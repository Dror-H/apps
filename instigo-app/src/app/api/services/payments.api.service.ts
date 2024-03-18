import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Resources } from '@instigo-app/data-transfer-object';

@Injectable()
export class PaymentsApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.PAYMENTS);
  }
}
