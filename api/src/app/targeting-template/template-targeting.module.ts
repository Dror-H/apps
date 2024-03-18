import { CachingModule } from '@api/database';
import { WorkspaceModule } from '@api/workspace/workspace.module';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TargetingTemplateController } from './controller/targeting-template.controller';
import { TargetingTemplateRepository } from './data/targeting-template.repository';
import { TargetingSearchService } from './service/targeting-search.service';
import { TargetingTemplateNestCrudService } from './service/targeting-template.nestcrud.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TargetingTemplateRepository]),
    ThirdPartyApiIntegrationModule,
    WorkspaceModule,
    CachingModule,
  ],
  providers: [TargetingTemplateNestCrudService, TargetingSearchService],
  controllers: [TargetingTemplateController],
  exports: [TypeOrmModule],
})
export class TemplateTargetingModule {}
