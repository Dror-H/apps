import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignGroupController } from './controller/campaign-group.controller';
import { CampaignGroupRepository } from './data/campaign-group.repository';
import { CampaignGroupNestCrudService } from './service/campaign-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignGroupRepository])],
  providers: [CampaignGroupNestCrudService],
  controllers: [CampaignGroupController],
  exports: [TypeOrmModule],
})
export class CampaignGroupModule {}
