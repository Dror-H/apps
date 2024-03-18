import { Test, TestingModule } from '@nestjs/testing';
import { ProviderNotificationScraperService } from './provider-notification-scraper.service';
import { ThirdPartyNotificationApiService } from '@instigo-app/third-party-connector';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';

describe('ProviderNotificationScraperService', () => {
  let service: ProviderNotificationScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderNotificationScraperService,
        { provide: ThirdPartyNotificationApiService, useValue: {} },
        { provide: AdAccountRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<ProviderNotificationScraperService>(ProviderNotificationScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
