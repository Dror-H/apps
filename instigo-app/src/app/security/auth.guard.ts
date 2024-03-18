import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from './auth.state';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
  @SelectSnapshot(AuthState.get)
  token: string;

  constructor(private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      jwt_decode(this.token);
      return true;
    } catch (error) {
      return this.store.dispatch([new StateResetAll(), new Navigate([`auth/login`])]).pipe(map(() => false));
    }
  }
}
