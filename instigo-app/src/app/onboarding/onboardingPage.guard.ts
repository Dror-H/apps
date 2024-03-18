import { Inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
@Injectable()
export class OnboardingPageGuard implements CanActivate {
  @Select(UserState.get)
  user$: Observable<User>;

  constructor(@Inject('DASHBOARD') private DASHBOARD: string, private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.user$.pipe(
      take(1),
      switchMap((user: User) => {
        if (user.onboarding?.completed) {
          return this.store.dispatch(new Navigate([this.DASHBOARD])).pipe(map(() => false));
        }
        return of(true);
      }),
    );
  }
}
