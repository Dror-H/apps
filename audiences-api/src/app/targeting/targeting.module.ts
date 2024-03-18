import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TargetingController } from './targeting.controller';
import { TargetingService } from './targeting.service';
import { CachingModule } from '../shared/caching.module';
import { MergeTargetingsService } from './merge-targetings.service';
import { TargetingExportService } from './targeting-export/targeting-export.service';
import { CampaignExportManagerService } from '@audiences-api/targeting/targeting-export/campaign-export-manager.service';
import { AdSetExportManagerService } from '@audiences-api/targeting/targeting-export/ad-set-export-manager.service';
import { AudiencesSharedModule } from '@instigo-app/api-shared';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, ThirdPartyApiIntegrationModule, CachingModule, AudiencesSharedModule, HttpModule],
  controllers: [TargetingController],
  providers: [
    TargetingService,
    TargetingExportService,
    MergeTargetingsService,
    CampaignExportManagerService,
    AdSetExportManagerService,
  ],
  exports: [MergeTargetingsService],
})
export class TargetingModule {}
