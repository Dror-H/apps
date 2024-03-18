import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { AuthService } from '@audience-app/global/services/auth/auth.service';
import { AuthState } from '@audience-app/store/auth.state';
import { UserState } from '@audience-app/store/user.state';
import { decodeUrlState } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthResolve implements Resolve<void> {
  @Emitter(UserState.updateUserAndAdAccounts) updateUser: Emittable<UserState>;
  @Emitter(UserState.updateUserAndAdAccounts) setUser: Emittable<UserState>;
  @Emitter(AuthState.set) setToken: Emittable<string>;

  constructor(private authService: AuthService, private router: Router) {}

  resolve(next: ActivatedRouteSnapshot): Observable<void> | Promise<void> | void {
    const { state } = next.queryParams;
    if (state) {
      const { token, redirect } = decodeUrlState(state);
      this.setToken.emit(token);
      void this.router.navigateByUrl(redirect);
    }

    this.authService
      .getUserInfo()
      .pipe(
        catchError(() => {
          this.setUser.emit(null);
          return EMPTY;
        }),
      )
      .subscribe((user) => {
        this.updateUser.emit(user);
      });
  }
}
