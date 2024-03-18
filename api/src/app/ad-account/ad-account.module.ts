import { QueueModule } from '@api/database';
import { ThirdPartyApiIntegrationModule } from '@instigo-app/third-party-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdAccountController } from './controllers/ad-account.controller';
import { PageController } from './controllers/page.controller';
import { AdAccountRepository } from './data/ad-account.repository';
import { AdAccountSubscriber } from './data/ad-account.subscriber';
import { PageRepository } from './data/page.repository';
import { AdAccountNestCrudService } from './services/ad-account.nestcrud.service';
import { AdAccountService } from './services/ad-account.service';
import { AvailableAdAccountsForIntegrationService } from './services/available-ad-accounts-for-integration.service';
import { PageNestCrudService } from './services/page.nestcrud.service';

@Module({
  imports: [
    QueueModule,
    TypeOrmModule.forFeature([AdAccountRepository, PageRepository]),
    ThirdPartyApiIntegrationModule,
  ],
  providers: [
    AdAccountNestCrudService,
    PageNestCrudService,
    AdAccountSubscriber,
    AvailableAdAccountsForIntegrationService,
    AdAccountService,
  ],
  controllers: [AdAccountController, PageController],
  exports: [TypeOrmModule, AdAccountService],
})
export class AdAccountModule {}
