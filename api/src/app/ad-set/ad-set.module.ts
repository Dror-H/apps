import { CachingModule } from '@api/database';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdSetController } from './controller/ad-set.controller';
import { AdSetNestCrudService } from './service/ad-set.nestcrud.service';
import { AdSetService } from './service/ad-set.service';
import { AdSet } from '@api/ad-set/data/ad-set.entity';

@Module({
  controllers: [AdSetController],
  imports: [TypeOrmModule.forFeature([AdSet]), CachingModule, ThirdPartyApiIntegrationModule],
  providers: [AdSetNestCrudService, AdSetService],
  exports: [TypeOrmModule],
})
export class AdSetModule {}
