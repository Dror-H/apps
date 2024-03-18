import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as passport from 'passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Request } from 'express';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { HttpModule } from '@nestjs/axios';
import { AccountControlModule } from '@audiences-api/account-control/account-control.module';

const facebookStrategyConfigFactory = {
  provide: 'FACEBOOK_STRATEGY_CONFIG',
  useFactory: (
    configService: ConfigService,
  ): {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    profileFields: string[];
    passReqToCallback: boolean;
  } => ({
    clientID: `${configService.get<string>('FACEBOOK_CLIENT_ID')}`,
    clientSecret: `${configService.get<string>('FACEBOOK_CLIENT_SECRET')}`,
    callbackURL: `${configService.get<string>('FACEBOOK_OAUTH_REDIRECT_URI')}`,
    profileFields: ['id', 'emails', 'name'],
    passReqToCallback: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: true, signOptions: { expiresIn: '60s' } }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    HttpModule,
    ThirdPartyApiIntegrationModule,
    AccountControlModule,
  ],
  controllers: [AuthController, MeController],
  providers: [facebookStrategyConfigFactory, LocalStrategy, JwtStrategy, FacebookStrategy, AuthService, MeService],
  exports: [MeService],
})
export class AuthModule {
  public configure(consumer: MiddlewareConsumer): void {
    const facebookOptions = {
      session: false,
      scope: ['email', 'ads_management', 'ads_read', 'business_management', 'pages_read_engagement'],
      state: null,
    };
    consumer
      .apply((req: Request, _res: any, next: () => void) => {
        const state = req.query?.state;
        facebookOptions.state = state;
        next();
      }, passport.authenticate('facebook', facebookOptions))
      .forRoutes(`auth/facebook/login`, `auth/facebook/callback`);
  }
}
