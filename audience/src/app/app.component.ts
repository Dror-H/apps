import { Component } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'audi-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  private updateSmartlook(user: User): void {
    try {
      window['smartlook']('identify', user.id, {
        name: user.name,
        email: user.email,
      });
    } catch (e) {
      console.log(e);
    }
  }

  private updateChatwoot(user: User): void {
    try {
      window['$chatwoot'].setUser(user.id, {
        name: user.name,
        email: user.email,
        avatar_url: user.profilePicture,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
