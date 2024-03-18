import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from './auth.state';

@Injectable()
export class JWTInterceptorService implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('server')) {
      const token = this.store.selectSnapshot(AuthState.get);
      const workspace = this.store.selectSnapshot(WorkspaceState.get);
      const appHeaders = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Current-Workspace': req.headers.get('current-workspace')
          ? req.headers.get('current-workspace')
          : `${workspace?.id || null}`,
      };
      const requestWithToken = req.clone({ setHeaders: appHeaders });
      return next.handle(requestWithToken);
    }
    return next.handle(req);
  }
}
