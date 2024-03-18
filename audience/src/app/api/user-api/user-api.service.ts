import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';
import { VatNumberValidation } from '@instigo-app/data-transfer-object';
import { UserApiServiceInterface } from '@instigo-app/ui/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService implements Partial<UserApiServiceInterface> {
  constructor(private httpClient: HttpClient) {}

  me(): Observable<User> {
    return this.httpClient.get<User>(`server/me`);
  }

  updateMe({ payload }: { payload: User }): Observable<any> {
    delete payload.email;
    return this.httpClient.put('server/me', payload);
  }

  validateVatNumber(country: string, vatNumber: string): Observable<VatNumberValidation> {
    return this.httpClient.get<VatNumberValidation>(`server/vat-check/${country}/${vatNumber}`);
  }
}
