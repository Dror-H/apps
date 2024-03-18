import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { UserState } from '@audience-app/store/user.state';

@Injectable()
export class UnauthorizedInterceptorService implements HttpInterceptor {
  @Emitter(UserState.updateUserAndAdAccounts) setUser: Emittable<UserState>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.setUser.emit(null);
        }
        return throwError(err);
      }),
    );
  }
}
