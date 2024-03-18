import { User } from '@api/user/data/user.entity';
import { InvalidStateScopeException, UndefinedSocialProfileException } from '@instigo-app/api-shared';
import { Profile, SupportedProviders, TokenStatus, Callback } from '@instigo-app/data-transfer-object';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedirectOptions } from '@nestjsplus/redirect';
import { addDays, fromUnixTime } from 'date-fns';
import { Base64 } from 'js-base64';
import { isEmpty, isNil, isUndefined, lowerCase } from 'lodash';
import { StateScope } from '../auth.module';
import { OauthTokenRepository } from '../data/oauthToken.repository';
import { AuthService } from './auth.service';
import { DeviceVerificationService } from './device-verification.service';

@Injectable()
export class SocialLoginService {
  readonly logger = new Logger(SocialLoginService.name);

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(OauthTokenRepository)
  private readonly oAuthTokenRepository: OauthTokenRepository;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(DeviceVerificationService)
  private readonly deviceVerificationService: DeviceVerificationService;

  async socialStrategyWorkflow(options: {
    request: any;
    accessToken: string;
    refreshToken: string;
    profile: Profile;
    done: Callback;
  }): Promise<Callback> {
    const { done } = options;
    try {
      const { request, accessToken, refreshToken, profile } = options;
      if (isNil(profile) || !profile.id) {
        throw new UndefinedSocialProfileException();
      }
      const { state } = request.query;
      const uncompressedState = JSON.parse(Base64.decode(state));
      const { user: stateUser, scope } = uncompressedState as { user: User; scope: StateScope };
      profile.email = this.getProfileEmail({ scope, user: stateUser, profile });
      const expiresAt = addDays(Date.now(), 60).getTime();
      const grantedAt = Date.now();
      try {
        const user = await this.authService.checkUserByEmail(profile.email);
        return this.findOrCreateUserToken(
          { user, accessToken, refreshToken, expiresAt, grantedAt, scope, profile },
          done,
        );
      } catch (error) {
        const user = await this.registerUser({ profile, accessToken, refreshToken, expiresAt, grantedAt, scope });
        return done(null, user);
      }
    } catch (error) {
      this.logger.error(error);
      return done(null, null);
    }
  }

  getProfileEmail(options: { scope: StateScope; user: User; profile: Profile }): string {
    const { scope, user, profile } = options;
    switch (scope) {
      case StateScope.LOGIN:
        return profile.emails && profile.emails.length && profile.emails[0].value
          ? profile.emails[0].value
          : `${profile.id}@${profile.provider}.com`;
      case StateScope.AUTHORIZE_APP:
        return user.email;
      default:
        throw new InvalidStateScopeException({ scope });
    }
  }

  async registerUser(options: {
    profile: Profile;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    grantedAt: number;
    scope: StateScope;
  }): Promise<User> {
    const { profile, accessToken, refreshToken, expiresAt, grantedAt, scope } = options;
    const email = profile.email;
    const username = lowerCase(profile.name.familyName);
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const password = `${profile.provider}${profile.id}`;
    const pictureUrl = this.getPictureUrl({ profile });
    const user = await this.authService.createUser({
      user: { email, username, password, firstName, lastName, pictureUrl },
    });
    await this.oAuthTokenRepository.addTokenToUser({
      user,
      profile,
      accessToken,
      refreshToken,
      expiresAt,
      grantedAt,
      scope,
    });
    return user;
  }

  getPictureUrl({ profile }) {
    const { photos, provider, id } = profile;
    if (!isEmpty(photos)) {
      return photos[0].value;
    }
    if (provider === SupportedProviders.FACEBOOK) {
      return `https://graph.facebook.com/${id}/picture?type=square`;
    }
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    return `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}`;
  }

  async findOrCreateUserToken(
    options: {
      user: User;
      profile: Profile;
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
      grantedAt: number;
      scope: StateScope;
    },
    done: Callback,
  ): Promise<Callback> {
    const { user, profile, accessToken, refreshToken, expiresAt, grantedAt, scope } = options;
    try {
      const oauthTokensAccesstoken = await this.oAuthTokenRepository.findOneOrFail({
        where: {
          user,
          providerClientId: profile.id,
          provider: profile.provider,
        },
      });
      if (accessToken !== oauthTokensAccesstoken.accessToken) {
        await this.oAuthTokenRepository.save({
          ...oauthTokensAccesstoken,
          scope: oauthTokensAccesstoken.scope === StateScope.AUTHORIZE_APP ? StateScope.AUTHORIZE_APP : scope,
          status: TokenStatus.ACTIVE,
          accessToken,
          refreshToken,
          expiresAt: fromUnixTime(expiresAt),
          grantedAt: fromUnixTime(grantedAt),
        });
      }

      return done(null, user);
    } catch (error) {
      this.logger.warn(error);
      await this.oAuthTokenRepository.addTokenToUser({
        user,
        profile,
        accessToken,
        refreshToken,
        expiresAt,
        grantedAt,
        scope,
      });
      return done(null, user);
    }
  }

  async socialCallback(options: { req: any; provider: SupportedProviders; state: string }): Promise<RedirectOptions> {
    try {
      const { req, state } = options;
      const { redirect } = JSON.parse(Base64.decode(state));
      const { user } = req;
      const { token } = await this.authService.createJwtToken({ user });
      if (!isUndefined(redirect)) {
        return {
          statusCode: HttpStatus.FOUND,
          url: `${redirect}`,
        };
      }
      void this.deviceVerificationService.verifyDevice({ request: req, user });
      return this.redirectLoggedInUser({ user, token });
    } catch (error) {
      return {
        statusCode: HttpStatus.AMBIGUOUS,
        url: `${this.configService.get('FRONTEND_HOST')}/auth/login`,
      };
    }
  }

  redirectLoggedInUser(options: { user: User; token: string }): RedirectOptions {
    const { user, token } = options;
    if (!user.onboarding.completed) {
      return {
        statusCode: HttpStatus.FOUND,
        url: `${this.configService.get('FRONTEND_HOST')}/onboarding/${token}`,
      };
    }
    return { statusCode: HttpStatus.FOUND, url: `${this.configService.get('FRONTEND_HOST')}/token/${token}` };
  }
}
