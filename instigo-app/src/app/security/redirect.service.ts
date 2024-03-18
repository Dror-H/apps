import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class RedirectService implements CanActivate {
  constructor(@Inject('DASHBOARD') private DASHBOARD: string, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    void this.router.navigate([this.DASHBOARD]);
    return true;
  }
}
