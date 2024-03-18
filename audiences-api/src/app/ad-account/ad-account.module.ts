import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TargetingModule } from '../targeting/targeting.module';
import { AdAccountRepository } from './ad-account.repository';

@Module({
  imports: [PrismaModule, HttpModule, ThirdPartyApiIntegrationModule, TargetingModule],
  controllers: [],
  providers: [AdAccountRepository],
  exports: [AdAccountRepository],
})
export class AdAccountModule {}
