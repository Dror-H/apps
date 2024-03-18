import { InspectUserTokenService } from './services/inspect-user-token.service';
import { UserModule } from '@api/user/user.module';
import { WorkspaceModule } from '@api/workspace/workspace.module';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { EmailModule } from '@instigo-app/email';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as passport from 'passport';
import { AuthController } from './controllers/auth.controller';
import { EmailVerificationController } from './controllers/email-verification.controller';
import { PasswordController } from './controllers/password.controller';
import { OauthTokenRepository } from './data/oauthToken.repository';
import { AuthService } from './services/auth.service';
import { DeviceVerificationService } from './services/device-verification.service';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordService } from './services/password.service';
import { SocialLoginService } from './services/social-login.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { OauthTokensAccesstoken } from './data/oauth-tokens-accesstoken.entity';
import { AuthCronJobController } from './controllers/auth-cron.controller';
import { FacebookService } from './services/facebook.service';
import { HttpModule } from '@nestjs/axios';
import { PrettyLinkService } from '@instigo-app/api-shared';

export enum StateScope {
  LOGIN = 'login',
  AUTHORIZE_APP = 'authorizeApp',
}

const facebookStrategyConfigFactory = {
  provide: 'FACEBOOK_STRATEGY_CONFIG',
  useFactory: (configService: ConfigService) => ({
    clientID: `${configService.get('FACEBOOK_CLIENT_ID')}`,
    clientSecret: `${configService.get('FACEBOOK_CLIENT_SECRET')}`,
    callbackURL: `${configService.get('FACEBOOK_OAUTH_REDIRECT_URI')}/callback`,
    profileFields: ['id', 'emails', 'name'],
    passReqToCallback: true,
  }),
  inject: [ConfigService],
};

const googleStrategyConfigFactory = {
  provide: 'GOOGLE_STRATEGY_CONFIG',
  useFactory: (configService: ConfigService) => ({
    clientID: `${configService.get('GOOGLE_CLIENT_ID')}`,
    clientSecret: `${configService.get('GOOGLE_CLIENT_SECRET')}`,
    callbackURL: `${configService.get('GOOGLE_OAUTH_REDIRECT_URI')}/callback`,
    scope: ['email', 'profile'],
    passReqToCallback: true,
  }),
  inject: [ConfigService],
};

const linkedinConfigFactory = {
  provide: 'LINKEDIN_STRATEGY_CONFIG',
  useFactory: (configService: ConfigService) => ({
    clientID: `${configService.get('LINKEDIN_CLIENT_ID')}`,
    clientSecret: `${configService.get('LINKEDIN_CLIENT_SECRET')}`,
    callbackURL: `${configService.get('LINKEDIN_OAUTH_REDIRECT_URI')}/callback`,
    scope: [
      'r_emailaddress',
      'r_ads',
      'w_organization_social',
      'rw_ads',
      // 'rw_dmp_segments',
      'r_basicprofile',
      'r_liteprofile',
      'r_ads_reporting',
      'r_organization_social',
      'rw_organization_admin',
      'w_member_social',
      'r_1st_connections_size',
    ],
    passReqToCallback: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([OauthTokenRepository, OauthTokensAccesstoken]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true, signOptions: { expiresIn: '60s' } }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    forwardRef(() => UserModule),
    WorkspaceModule,
    ThirdPartyApiIntegrationModule,
  ],
  providers: [
    facebookStrategyConfigFactory,
    linkedinConfigFactory,
    googleStrategyConfigFactory,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    LinkedinStrategy,
    GoogleStrategy,
    AuthService,
    PasswordService,
    EmailVerificationService,
    DeviceVerificationService,
    SocialLoginService,
    InspectUserTokenService,
    FacebookService,
    PrettyLinkService,
  ],
  exports: [],
  controllers: [AuthController, PasswordController, EmailVerificationController, AuthCronJobController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    const facebookLoginOptions = {
      session: false,
      scope: ['email'],
      state: null,
    };
    const facebookAuthorizeAppOptions = {
      session: false,
      scope: ['email', 'ads_management', 'ads_read', 'business_management', 'pages_read_engagement'],
      state: null,
    };

    const linkedinAuthorizeAppOptions = {
      session: false,
      state: null,
    };

    const googleLoginOptions = {
      session: false,
      scope: ['email', 'profile'],
      state: null,
    };

    consumer
      .apply((req: any, res: any, next: () => void) => {
        const {
          query: { state },
        } = req;
        facebookLoginOptions.state = state;
        next();
      }, passport.authenticate(SupportedProviders.FACEBOOK, facebookLoginOptions))
      .forRoutes(`auth/${SupportedProviders.FACEBOOK}/social/login`)
      .apply((req: any, res: any, next: () => void) => {
        const {
          query: { state },
        } = req;
        facebookAuthorizeAppOptions.state = state;
        next();
      }, passport.authenticate(SupportedProviders.FACEBOOK, facebookAuthorizeAppOptions))
      .forRoutes(
        `auth/${SupportedProviders.FACEBOOK}/authorizeApp/login`,
        `auth/${SupportedProviders.FACEBOOK}/callback`,
      )
      .apply((req: any, res: any, next: () => void) => {
        const {
          query: { state },
        } = req;
        linkedinAuthorizeAppOptions.state = state;
        next();
      }, passport.authenticate(SupportedProviders.LINKEDIN, linkedinAuthorizeAppOptions))
      .forRoutes(
        `auth/${SupportedProviders.LINKEDIN}/authorizeApp/login`,
        `auth/${SupportedProviders.LINKEDIN}/callback`,
      )
      .apply((req: any, res: any, next: () => void) => {
        const {
          query: { state },
        } = req;
        googleLoginOptions.state = state;
        next();
      }, passport.authenticate(SupportedProviders.GOOGLE, googleLoginOptions))
      .forRoutes(`auth/${SupportedProviders.GOOGLE}/social/login`, `auth/${SupportedProviders.GOOGLE}/callback`);
  }
}
