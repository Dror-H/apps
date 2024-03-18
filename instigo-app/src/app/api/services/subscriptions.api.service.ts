import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resources } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { CrudService } from '../crud.service';

@Injectable()
export class SubscriptionsApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.SUBSCRIPTIONS);
  }
  updateSubscription(options: { payload: Partial<any> }): Observable<any> {
    const { payload } = options;
    return this.httpClient.patch(`server/${Resources.SUBSCRIPTIONS}`, payload);
  }
  cancelSubscription(): Observable<any> {
    return this.httpClient.delete(`server/${Resources.SUBSCRIPTIONS}`);
  }

  getAvailableAdProducts(): Observable<any> {
    return this.httpClient.get(`server/${Resources.SUBSCRIPTIONS}/plans`);
  }

  getCoupon({ id }) {
    return this.httpClient.get(`server/${Resources.SUBSCRIPTIONS}/coupons/${id}`);
  }

  invoices() {
    return this.httpClient.get(`server/${Resources.SUBSCRIPTIONS}/invoices`);
  }
}
