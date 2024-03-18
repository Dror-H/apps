import { FileManagerModule } from '@api/file-manager/file-manager.module';
import { InsightsServicesModule } from '@api/insights/services/insights-services.module';
import { SubscriptionModule } from '@api/subscription/subscription.module';
import { WorkspaceModule } from '@api/workspace/workspace.module';
import { SlackNotificationModule } from '@instigo-app/slack-notification';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeController } from './controllers/me.controller';
import { UserCronJobsController } from './controllers/user-cron.controller';
import { UserController } from './controllers/user.controller';
import { VatController } from './controllers/vat.controller';
import { UserDeviceMetadataRepository } from './data/user-device-metadata.repository';
import { UserRepository } from './data/user.repository';
import { UserSubscriber } from './data/user.subscriber';
import { InspectUserAccountService } from './services/inspect-user-account-status.service';
import { InspectUserCostCapService } from './services/inspect-user-cost-cap.service';
import { UserSlackReportsService } from './services/user-slack-reports.service';
import { UserNestCrudService } from './services/user.nestcrud.service';
import { UserService } from './services/user.service';
import { VatService } from './services/vat.service';
@Module({
  imports: [
    SlackNotificationModule,
    TypeOrmModule.forFeature([UserRepository, UserDeviceMetadataRepository]),
    forwardRef(() => WorkspaceModule),
    ThirdPartyApiIntegrationModule,
    InsightsServicesModule,
    FileManagerModule,
    SubscriptionModule,
  ],
  providers: [
    UserService,
    UserNestCrudService,
    VatService,
    UserSubscriber,
    UserSlackReportsService,
    InspectUserAccountService,
    InspectUserCostCapService,
  ],
  controllers: [MeController, UserController, VatController, UserCronJobsController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
