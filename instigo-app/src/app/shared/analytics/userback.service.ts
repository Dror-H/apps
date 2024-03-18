import { Injectable } from '@angular/core';
import { User } from '@instigo-app/data-transfer-object';
import { whenUsernameIsEmptyOrRockstarReturnEmail } from '@app/global/utils';
import { UserState } from '@app/global/user.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { HotkeysService } from '@ngneat/hotkeys';

@Injectable()
export class UserbackService {
  @SelectSnapshot(UserState.get)
  user: User;

  constructor(private hotKeys: HotkeysService) {
    window['Userback'] = window['Userback'] || {};
    window['Userback'].access_token = '32599|59789|qluetH7vBPo2cq3SKIkhlAtVO';
    (function (d) {
      var s = d.createElement('script');
      s.async = true;
      s.src = 'https://static.userback.io/widget/v1.js';
      (d.head || d.body).appendChild(s);
    })(document);

    this.hotKeys.addShortcut({ keys: 'meta.u' }).subscribe((e) => window['Userback'].open());
  }

  public triggerModal() {
    try {
      window['Userback'].open();
    } catch (e) {
      console.error(e);
    }
  }

  public updateUserback(user: User): void {
    window['Userback'].email = this.user.email || '';
    window['Userback'].setData({
      account_id: user.id,
      name: whenUsernameIsEmptyOrRockstarReturnEmail(user),
    });
  }
}
