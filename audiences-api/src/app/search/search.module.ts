import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TargetingModule } from '../targeting/targeting.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SegmentsModule } from '../segments/segments.module';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { SearchFallBackService } from './search-fallback.service';
import { SearchRepository } from './search.repository';
import { AudiencesSharedModule } from '@instigo-app/api-shared';
import { CachingModule } from '@audiences-api/shared/caching.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    SegmentsModule,
    TargetingModule,
    ThirdPartyApiIntegrationModule,
    AudiencesSharedModule,
    CachingModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, SearchFallBackService, SearchRepository],
})
export class SearchModule {}
