import { Profile } from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as passport from 'passport';
import { Profile as LinkedinProfile, Strategy } from 'passport-linkedin-oauth2';
import { SocialLoginService } from '../services/social-login.service';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  @Inject(SocialLoginService)
  private readonly socialLoginService: SocialLoginService;

  constructor(
    @Inject('LINKEDIN_STRATEGY_CONFIG')
    private readonly linkedinStrategyConfig: any,
  ) {
    super(
      linkedinStrategyConfig,
      async (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: LinkedinProfile,
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
