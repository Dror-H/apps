import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { UserState } from '@app/global/user.state';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from './auth.state';
import jwt_decode from 'jwt-decode';

@Injectable()
export class SetJwtService implements CanActivate {
  @Emitter(AuthState.set)
  setToken: Emittable<string>;

  @Emitter(UserState.set)
  setUser: Emittable<string>;

  constructor(private store: Store) {}

  canActivate(
    next: ActivatedRouteSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      const { token } = next.params;
      const data: any = jwt_decode(token);
      return combineLatest([this.setUser.emit(data.user), this.setToken.emit(token)]).pipe(map(() => true));
    } catch (error) {
      return this.store.dispatch([new StateResetAll(), new Navigate([`auth/login`])]).pipe(map(() => false));
    }
  }
}
