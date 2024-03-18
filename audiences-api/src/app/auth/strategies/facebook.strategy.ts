import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import to from 'await-to-js';
import { Request } from 'express';
import * as passport from 'passport';
import { Profile as FacebookProfile, Strategy, StrategyOption } from 'passport-facebook';
import { AuthService } from '../auth.service';
import fetch from 'node-fetch';
import { isEmpty } from 'lodash';
import { Merge } from 'type-fest';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  @Inject(AuthService)
  private readonly authService: AuthService;

  private getProfileEmail(profile: FacebookProfile): string {
    if (profile.emails && profile.emails.length && profile.emails[0].value) {
      return profile.emails[0].value;
    }
    return `${profile.id}@${profile.provider}.com`;
  }

  private getProfileUserName(profile: Merge<FacebookProfile, { email: string }>): string {
    const userName = `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.toLowerCase();
    return !isEmpty(userName) && userName.trim().length > 0 ? userName : profile?.email.split('@')[0];
  }

  private async getProfilePicture(profile: Merge<FacebookProfile, { userName: string }>): Promise<string> {
    if (profile.profileUrl) {
      const [err, result] = await to(fetch(profile.profileUrl));
      if (result?.status !== 200 || err) {
        return `https://eu.ui-avatars.com/api/?name=${profile.userName}`;
      }
      return profile.profileUrl;
    }
    const [err, result] = await to(fetch(`https://graph.facebook.com/${profile.id}/picture?type=square`));
    if (result?.status === 200 || !err) {
      return result.url;
    }
    return `https://eu.ui-avatars.com/api/?name=${profile.userName}`;
  }

  constructor(
    @Inject('FACEBOOK_STRATEGY_CONFIG')
    private readonly facebookStrategyConfig: StrategyOption,
  ) {
    super(
      facebookStrategyConfig,
      async (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: Merge<FacebookProfile, { userName: string; email: string; firstName: string; lastName: string }>,
        done: (error: any, user?: any, info?: any) => void,
      ) => {
        const email = this.getProfileEmail(profile);
        profile['email'] = email;
        profile['userName'] = this.getProfileUserName(profile);
        profile['firstName'] = profile.name.givenName;
        profile['lastName'] = profile.name.familyName;
        profile['profilePicture'] = await this.getProfilePicture(profile);

        return this.authService.facebookStrategy({
          request,
          accessToken,
          refreshToken,
          profile,
          done,
        });
      },
    );
    passport.use(this);
  }
}
