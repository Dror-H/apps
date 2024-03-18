import { AdAccountModule } from '@api/ad-account/ad-account.module';
import { CachingModule, QueueModule } from '@api/database';
import { FileManagerModule } from '@api/file-manager/file-manager.module';
import { WorkspaceModule } from '@api/workspace/workspace.module';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudienceController } from './controllers/audience.controller';
import { AudienceRepository } from './data/audience.repository';
import { AudienceNestCrudService } from './services/audience.nestcrud.service';
import { MulterConfigService, UploadUtilityModule } from '@instigo-app/upload-utility';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    forwardRef(() => AdAccountModule),
    TypeOrmModule.forFeature([AudienceRepository]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    UploadUtilityModule,
    QueueModule,
    CachingModule,
    forwardRef(() => ThirdPartyApiIntegrationModule),
    WorkspaceModule,
    FileManagerModule,
  ],
  providers: [AudienceNestCrudService],
  controllers: [AudienceController],
})
export class AudienceModule {}
