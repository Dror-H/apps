import { Inject, Injectable } from '@angular/core';
import { WebsiteUserApiService } from '@app/api/services/website-user.api.service';
import { AuthState } from '@app/security/auth.state';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { StateReset, StateResetAll } from 'ngxs-reset-plugin';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    @Inject('LOGIN_PAGE') private LOGIN_PAGE: string,
    private store: Store,
    private websiteUserApi: WebsiteUserApiService,
  ) {}

  public logout() {
    this.websiteUserApi.deleteWebsiteUser();
    try {
      window['Intercom']('shutdown');
    } catch (e) {
      console.log(e);
    }

    try {
      window['FB'].api('/me/permissions', 'delete', null, () => window['FB'].logout());
    } catch (e) {
      console.log(e);
    }

    this.store
      .dispatch([new StateReset(AuthState), new Navigate([this.LOGIN_PAGE])])
      .subscribe(() => new StateResetAll());
  }
}
