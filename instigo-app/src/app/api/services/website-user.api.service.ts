import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class WebsiteUserApiService {
  @SelectSnapshot(UserState.get)
  public user: User;

  constructor(protected httpClient: HttpClient) {}

  getCookie(cookie_name: string): any {
    const re = new RegExp(`(?<=${cookie_name}=)[^;]*`);
    try {
      return document.cookie.match(re)[0];
    } catch {
      return "this-cookie-doesn't-exist";
    }
  }

  updateWebsiteUser(user: User): any {
    const cookie_id = this.getCookie('intercom-id-jijxfh9m');
    const action = 'instigo_user_webhook';
    const apiKey = environment.websiteKey;
    const url = environment.websiteUrl;
    if (!url || !apiKey || cookie_id.length < 5) {
      return;
    }
    return this.httpClient
      .post<any>(
        `${url}/?wpwhpro_action=${action}&wpwhpro_api_key=${apiKey}&action=custom_action&wpwh_identifier=${action}`,
        {
          cookie_id,
          username: user?.username,
          first_name: user?.firstName,
          last_name: user?.lastName,
          email: user?.email,
          picture_url: user?.pictureUrl,
        },
        { headers: { ignoreLoadingBar: '' } },
      )
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }

  deleteWebsiteUser(): any {
    const action = 'instigo_user_webhook';
    const apiKey = 'dgd55wuzoglpwvzov2v7cn8ohk78moeznlgri5jvpgr1j6efdvdlje2ufpgnwdzq';
    return this.httpClient
      .post<any>(
        `https://instigo.io/?wpwhpro_action=${action}&wpwhpro_api_key=${apiKey}&action=custom_action&wpwh_identifier=${action}`,
        {
          email: this.user?.email,
          delete: true,
        },
        { headers: { ignoreLoadingBar: '' } },
      )
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }
}
