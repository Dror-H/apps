import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { Resources } from '@instigo-app/data-transfer-object';
import { CrudService, Invoice, SubscriptionsApiServiceInterface } from '@instigo-app/ui/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// TODO - change type any from CrudService generic
export default class SubscriptionsApiService
  extends CrudService<any, string>
  implements SubscriptionsApiServiceInterface
{
  constructor(protected httpClient: HttpClient, private displayNotificationService: DisplayNotificationService) {
    super(httpClient, 'server', Resources.SUBSCRIPTIONS);
  }

  updateSubscription(options: { payload: Partial<any> }): Observable<any> {
    throw new Error('Method not implemented.');
  }

  cancelSubscription(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getAvailableAdProducts(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getCoupon({ id }: { id: string }) {
    throw new Error('Method not implemented.');
  }

  invoices(): Observable<Invoice[]> {
    return this.httpClient.get<Invoice[]>(`server/${Resources.ME}/invoices`);
  }
}
