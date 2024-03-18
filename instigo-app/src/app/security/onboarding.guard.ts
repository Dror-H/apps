import { Inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import isUndefined from 'lodash-es/isUndefined';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class OnboardingGuard implements CanActivate {
  @Select(UserState.get)
  getUser$: Observable<User>;

  constructor(@Inject('DASHBOARD') private DASHBOARD: string, private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getUser$.pipe(
      take(1),
      map((user: User) => {
        if (!isUndefined(user.onboarding) && !user.onboarding?.completed) {
          this.store.dispatch(new Navigate([`onboarding`]));
          return false;
        }
        return true;
      }),
    );
  }
}
