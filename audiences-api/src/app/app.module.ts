import { HttpLoggerMiddleware } from '@nest-toolbox/http-logger-middleware';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { AdAccountModule } from './ad-account/ad-account.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { TargetingModule } from './targeting/targeting.module';
import { AuditLogsService } from './audit_logs/audit_logs.service';
import { AccountControlModule } from './account-control/account-control.module';
import { EmailModule } from '@instigo-app/email';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { transport: process.env.ENVIRONMENT === 'development' ? { target: 'pino-pretty' } : undefined },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    SearchModule,
    AuthModule,
    AdAccountModule,
    EmailModule,
    TargetingModule,
    TerminusModule,
    PrismaModule,
    AccountControlModule,
  ],
  controllers: [AppController],
  providers: [AuditLogsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).exclude('notifications', 'health').forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
