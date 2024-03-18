import { Profile } from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile as GoogleProfile, Strategy } from 'passport-google-oauth20';
import { SocialLoginService } from '../services/social-login.service';
import passport = require('passport');

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  @Inject(SocialLoginService)
  private readonly socialLoginService: SocialLoginService;

  constructor(
    @Inject('GOOGLE_STRATEGY_CONFIG')
    private readonly googleStrategyConfig,
  ) {
    super(
      googleStrategyConfig,
      async (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
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
