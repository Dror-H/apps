import { AdAccountModule } from '@api/ad-account/ad-account.module';
import { AdSetModule } from '@api/ad-set/ad-set.module';
import { AdModule } from '@api/ad/ad.module';
import { CampaignDraftModule } from '@api/campaign-draft/campaign-draft.module';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { CampaignCreationService } from '@api/campaign/services/facebook/campaign-creation.service';
import { CachingModule } from '@api/database';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignDetailsModule } from './campaign-details/campaign-details.module';
import { CampaignController } from './controllers/campaign.controller';
import { CampaignThroughInstigoRecord } from './data/campaign-through-instigo-record.entity';
import { CampaignNestCrudService } from './services/campaign.nestcrud.service';
import { CampaignService } from './services/campaign.service';
import { LinkedinCampaignCreationService } from './services/linkedin/linkedin-campaign-creation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignThroughInstigoRecord]),
    ThirdPartyApiIntegrationModule,
    CachingModule,
    AdAccountModule,
    AdModule,
    AdSetModule,
    CampaignDraftModule,
    CampaignDetailsModule,
  ],
  providers: [CampaignNestCrudService, CampaignService, CampaignCreationService, LinkedinCampaignCreationService],
  controllers: [CampaignController],
  exports: [TypeOrmModule],
})
export class CampaignModule {}
