import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { UpdateUser, UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable()
export class NoWorkspaceGuard implements CanActivate {
  @Select(UserState.get)
  getUser$: Observable<User>;

  constructor(private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getUser$.pipe(
      take(1),
      switchMap((user: User) => {
        if (user?.assignedWorkspaces?.length === 0) {
          return this.store.dispatch(new UpdateUser({ onboarding: { completed: false } })).pipe(
            switchMap(() => this.store.dispatch(new Navigate([`onboarding`]))),
            map(() => false),
          );
        }
        return of(true);
      }),
    );
  }
}
