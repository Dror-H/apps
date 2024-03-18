import { FileManagerModule } from '@api/file-manager/file-manager.module';
import { WorkspaceModule } from '@api/workspace/workspace.module';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdTemplateController } from './controllers/ad-template.controller';
import { AdTemplateRepository } from './data/ad-template.repository';
import { AdTemplateNestCrudService } from './services/ad-template.nestcrud.service';
import { AdTemplateService } from './services/ad-template.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdTemplateRepository]),
    ThirdPartyApiIntegrationModule,
    WorkspaceModule,
    FileManagerModule,
  ],
  controllers: [AdTemplateController],
  providers: [AdTemplateNestCrudService, AdTemplateService],
})
export class AdTemplateModule {}
