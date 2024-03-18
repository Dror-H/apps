import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdController } from './controller/ad.controller';
import { AdNestCrudService } from './service/ad.nestcrud.service';
import { AdService } from '@api/ad/service/ad.service';
import { Ad } from '@api/ad/data/ad.entity';
import { CachingModule } from '@api/database';

@Module({
  controllers: [AdController],
  imports: [TypeOrmModule.forFeature([Ad]), CachingModule, ThirdPartyApiIntegrationModule],
  providers: [AdNestCrudService, AdService],
  exports: [TypeOrmModule],
})
export class AdModule {}
