import { Injectable } from '@angular/core';
import { UserState } from '@app/global/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { getUnixTime } from 'date-fns';
import { whenUsernameIsEmptyOrRockstarReturnEmail } from '@app/global/utils';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  static instance: AnalyticsService;

  constructor(private dispatcher: Angulartics2, private gtm: Angulartics2GoogleTagManager) {
    AnalyticsService.instance = this;
  }

  @SelectSnapshot(UserState.get)
  public user: User;

  public start(): void {
    this.gtm.startTracking();
    this.gtm.setUsername(this.user.id);
  }

  public updateIntercom(user: User): void {
    const intercomData = {
      email: user.email,
      user_id: user.id,
      created_at: getUnixTime(new Date(user.createdAt)),
      user_name: whenUsernameIsEmptyOrRockstarReturnEmail(user),
      phone: user.phone,
      avatar: user.pictureUrl,
      user_hash: user.intercomIdentifierSHA,
    };
    this.gtm.pushLayer({ event: 'UpdateIntercom', intercom_data: intercomData });
  }

  public updateSmartlook(user: User): void {
    try {
      window['smartlook']('identify', user.id, {
        name: whenUsernameIsEmptyOrRockstarReturnEmail(user),
        email: user.email,
        stripeId: user.stripeCustomerId,
      });
    } catch (e) {
      console.log(e);
    }
  }

  public sendTrigger(options: any): void {
    const { action, event, data } = options;
    this.dispatcher.eventTrack.next({
      action: action,
      properties: {
        event: event,
        ...data,
      },
    });
  }

  public sendEvent(options: any): void {
    this.dispatcher.eventTrack;
    const { event, action, data } = options;
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push({
      event,
      action,
      ...data,
    });
  }
}
