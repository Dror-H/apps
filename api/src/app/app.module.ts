import { CampaignDraftModule } from '@api/campaign-draft/campaign-draft.module';
import { EventsModule } from '@api/events/events.module';
import { JsonBodyMiddleware, RawBodyMiddleware } from '@golevelup/nestjs-webhooks';
import { HealthCheckModule } from '@instigo-app/api-shared';
import { EmailModule } from '@instigo-app/email';
import { AccessControlModule, RulesBuilder } from '@nest-toolbox/access-control';
import { HttpLoggerMiddleware } from '@nest-toolbox/http-logger-middleware';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ACLGuard } from './access-control/access-control.guard';
import { conditions, grants } from './access-control/data';
import { AdAccountModule } from './ad-account/ad-account.module';
import { AdSetModule } from './ad-set/ad-set.module';
import { AdTemplateModule } from './ad-template/ad-template.module';
import { AdModule } from './ad/ad.module';
import { AppController } from './app.controller';
import { AudienceModule } from './audience/audience.module';
import { AuthModule } from './auth';
import { CampaignGroupModule } from './campaign-group/campaign-group.module';
import { CampaignModule } from './campaign/campaign.module';
import { DatabaseModule } from './database';
import { FileManagerModule } from './file-manager/file-manager.module';
import { InsightsModule } from './insights/insights.module';
import { LeadgenFormModule } from './leadgen-form/leadgen-form.module';
import { NotificationModule } from './notification/notification.module';
import { PlatformScraperModule } from './platform-scraper/platformScraper.module';
import { PostModule } from './post/post.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TemplateTargetingModule } from './targeting-template/template-targeting.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ValidationModule } from '@api/validation/validation.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: { transport: process.env.ENVIRONMENT === 'development' ? { target: 'pino-pretty' } : undefined },
    }),
    JsonBodyMiddleware,
    RawBodyMiddleware,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthCheckModule,
    AuthModule,
    CampaignModule,
    CampaignGroupModule,
    CampaignDraftModule,
    UserModule,
    WorkspaceModule,
    AdAccountModule,
    EmailModule,
    ValidationModule,
    PlatformScraperModule,
    InsightsModule,
    AudienceModule,
    ReportsModule,
    AdModule,
    AdSetModule,
    TemplateTargetingModule,
    AdTemplateModule,
    SubscriptionModule,
    PostModule,
    LeadgenFormModule,
    EventsModule,
    AccessControlModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RulesBuilder => new RulesBuilder(grants, conditions(configService)),
    }),
    FileManagerModule,
    NotificationModule,
  ],
  providers: [ACLGuard],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).exclude('notifications', 'health').forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
