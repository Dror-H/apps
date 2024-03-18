import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from '@audience-app/store/auth.state';
import { UserState } from '@audience-app/store/user.state';
import { encodeState } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';

@Injectable()
export class AuthApiService {
  @Emitter(UserState.updateUserAndAdAccounts) setUser: Emittable<UserState>;
  @Emitter(AuthState.set) setToken: Emittable<string>;

  constructor(
    private readonly http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
  ) {}

  public facebookLogin(): void {
    const urlFragment = this.router.url.split('/')[1];
    const state = {
      redirect: `${urlFragment}`,
    };
    this.document.location.href = `server/auth/facebook/login?state=${encodeState(state)}`;
  }

  public logout(): void {
    this.setToken.emit(null);
    this.setUser.emit(null);
    this.document.location.href = '';
  }

  public me(): Observable<UserState> {
    return this.http.get<UserState>('server/me');
  }
}
