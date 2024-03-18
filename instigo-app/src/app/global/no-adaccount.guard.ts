import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoAdAccountGuard implements CanActivate {
  @Select(WorkspaceState.totalAdAccounts)
  private readonly totalAdAccounts$: Observable<number>;

  constructor(private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.totalAdAccounts$.pipe(
      map((totalAdAccounts: number) => (totalAdAccounts === 0 ? this.router.parseUrl('/no-adaccount') : true)),
    );
  }
}
