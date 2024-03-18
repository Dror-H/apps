import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { Loading } from '@instigo-app/data-transfer-object';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { concat, EMPTY, from, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, toArray } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private router: Router, private http: HttpClient, private displayNotification: DisplayNotification) {}

  userProfile(): Observable<{ id: string; email: string; name: string }> {
    return from(
      new Promise<any>((resolve) =>
        window['FB'].api('/me?fields=id,name,email', (response) => {
          resolve(response);
        }),
      ),
    );
  }

  facebookLogin() {
    return from(
      new Promise<any>((resolve) =>
        window['FB'].getLoginStatus(({ authResponse }) => {
          resolve(authResponse);
        }),
      ),
    ).pipe(
      switchMap((authResponse) => {
        if (authResponse) {
          return of(authResponse);
        } else {
          return from(
            new Promise<any>((resolve) =>
              window['FB'].login(({ authResponse }) => resolve(authResponse), {
                scope: 'public_profile,email',
              }),
            ),
          );
        }
      }),
      switchMap((authResponse) => {
        if (!authResponse) return EMPTY;
        return concat(this.userProfile(), of(authResponse)).pipe(toArray());
      }),
      switchMap((data) => {
        const [profile, auth] = data;
        if (profile?.error) {
          return throwError({ error: profile.error });
        }
        return this.http.post('server/auth/handle-facebook-login', { profile, auth });
      }),
      switchMap((response: any) => this.router.navigate([response.next])),
      catchError((error) => {
        console.log(error);
        try {
          window['FB'].api('/me/permissions', 'delete', null, () => window['FB'].logout());
        } catch (e) {
          console.log(e);
        }
        return EMPTY;
      }),
    );
  }

  @Dispatch()
  loadingSpinner({ show }) {
    return new Loading({ loading: show });
  }

  throwError({ error }) {
    this.displayNotification.displayNotification(
      new Notification({ titleId: `app.login.error.${error.statusCode}`, type: NotificationType.ERROR }),
    );
  }

  showNotification({ notificationId }) {
    this.displayNotification.displayNotification(
      new Notification({ titleId: notificationId, type: NotificationType.SUCCESS }),
    );
  }

  navigate({ path }) {
    void this.router.navigate([path]);
  }
}
