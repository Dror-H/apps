import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthState } from '@app/security/auth.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable()
export class AlreadyLoggedInGuard implements CanActivate {
  @SelectSnapshot(AuthState.get) private token: string;

  constructor(@Inject('DASHBOARD') private DASHBOARD: string, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      jwt_decode(this.token);
      void this.router.navigate([this.DASHBOARD]);
      return false;
    } catch (error) {
      return true;
    }
  }
}
