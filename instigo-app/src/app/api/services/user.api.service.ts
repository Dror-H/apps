import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VatNumberValidation } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
@Injectable()
export class UserApiService {
  constructor(protected httpClient: HttpClient) {}

  me(): Observable<any> {
    return this.httpClient.get(`server/me`);
  }

  deleteMe() {
    return this.httpClient.delete(`server/me`);
  }

  deviceLoginHistory(): Observable<any> {
    return this.httpClient.get(`server/me/deviceLoginHistory`);
  }

  updateMe({ payload }): Observable<any> {
    return this.httpClient.put(`server/me`, payload);
  }

  changePassword({ payload }): Observable<any> {
    return this.httpClient.put(`server/me/change-password`, payload);
  }

  getUserByEmail(options: { email: string }): Observable<any> {
    const { email } = options;
    return this.httpClient.get(`server/user?filter=email||eq||${email}`);
  }

  validateVatNumber(country: string, vatNumber: string): Observable<VatNumberValidation> {
    return this.httpClient.get<VatNumberValidation>(`server/vat-check/${country}/${vatNumber}`);
  }
}
