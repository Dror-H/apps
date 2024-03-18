import { Profile } from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as passport from 'passport';
import { Profile as FacebookProfile, Strategy } from 'passport-facebook';
import { SocialLoginService } from '../services/social-login.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  @Inject(SocialLoginService)
  private readonly socialLoginService: SocialLoginService;

  constructor(
    @Inject('FACEBOOK_STRATEGY_CONFIG')
    private readonly facebookStrategyConfig,
  ) {
    super(
      facebookStrategyConfig,
      async (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: FacebookProfile,
        done: (error: any, user?: any, info?: any) => void,
      ) =>
        this.socialLoginService.socialStrategyWorkflow({
          request,
          accessToken,
          refreshToken,
          profile: profile as Profile,
          done,
        }),
    );
    passport.use(this);
  }
}
