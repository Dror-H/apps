import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
@Injectable()
export class AuthApiService {
  constructor(private httpClient: HttpClient) {}

  basingSignIn(body: { email: string; password: string }) {
    return this.httpClient.post('server/auth/signin', body).pipe(take(1));
  }

  basingSignUp(body: { email: string; password: string }) {
    return this.httpClient.post('server/auth/signup', body).pipe(take(1));
  }

  sendResetPasswordEmail(body: { user: { email: string } }) {
    return this.httpClient.post('server/auth/password/send', body).pipe(take(1));
  }

  resetPassword(body: { email: string; password: string }) {
    return this.httpClient.post('server/auth/password/reset', body).pipe(take(1));
  }
}
