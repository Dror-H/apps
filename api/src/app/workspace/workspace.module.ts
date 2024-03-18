import { AdAccountModule } from '@api/ad-account/ad-account.module';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { CachingModule } from '@api/database';
import { ExchangeRateModule } from '@api/exchange-rate/exchange-rate.module';
import { InsightsServicesModule } from '@api/insights/services/insights-services.module';
import { UserRepository } from '@api/user/data/user.repository';
import { UserModule } from '@api/user/user.module';
import { OnboardWorkspaceController } from '@api/workspace/controllers/onboard-workspace.controller';
import { OnboardWorkspaceService } from '@api/workspace/services/onboard-workspace.service';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceDashboardController } from './controllers/workspace-dashboard.controller';
import { WorkspaceInvitationsController } from './controllers/workspace-invitation.controller';
import { WorkspaceController } from './controllers/workspace.controller';
import { WorkspaceRepository } from './data/workspace.repository';
import { WorkspaceDashboardService } from './services/workspace-dashboard.service';
import { WorkspaceInvitationService } from './services/workspace-invitation.service';
import { WorkspaceNestCrudService } from './services/workspace.nestcrud.service';
import { WorkspaceService } from './services/workspace.service';
import { PrettyLinkService } from '@instigo-app/api-shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceRepository, AdAccountRepository, UserRepository]),
    ExchangeRateModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    InsightsServicesModule,
    CachingModule,
    AdAccountModule,
    forwardRef(() => UserModule),
  ],
  controllers: [
    WorkspaceController,
    WorkspaceInvitationsController,
    WorkspaceDashboardController,
    OnboardWorkspaceController,
  ],
  providers: [
    WorkspaceNestCrudService,
    WorkspaceInvitationService,
    WorkspaceDashboardService,
    OnboardWorkspaceService,
    PrettyLinkService,
    WorkspaceService,
    PrettyLinkService,
  ],
  exports: [WorkspaceNestCrudService, TypeOrmModule, WorkspaceService],
})
export class WorkspaceModule {}
