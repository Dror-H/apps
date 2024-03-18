import { CampaignDraftController } from '@api/campaign-draft/controllers/campaign-draft.controller';
import { CampaignDraft } from '@api/campaign-draft/data/campaign-draft.entity';
import { CampaignDraftNestCrudService } from '@api/campaign-draft/services/campaign-draft.nestcrud.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CampaignDraftController],
  imports: [TypeOrmModule.forFeature([CampaignDraft])],
  providers: [CampaignDraftNestCrudService],
  exports: [TypeOrmModule],
})
export class CampaignDraftModule {}
