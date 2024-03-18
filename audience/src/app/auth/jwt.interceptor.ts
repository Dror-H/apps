import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '@audience-app/store/auth.state';

@Injectable()
export class JWTInterceptorService implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('server')) {
      const token = this.store.selectSnapshot(AuthState.get);
      const appHeaders = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const requestWithToken = req.clone({ setHeaders: appHeaders });
      return next.handle(requestWithToken);
    }
    return next.handle(req);
  }
}
