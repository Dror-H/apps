import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { ThirdPartyNotificationApiService } from '@instigo-app/third-party-connector';
import { Test, TestingModule } from '@nestjs/testing';
import { SyncAdAccountByNotificationService } from './sync-ad-account-by-notification.service';
import { DataSynchronizationService } from '@api/platform-scraper/services/datasync.service';
import { of } from 'rxjs';

describe('SyncAdAccountByNotificationService', () => {
  let service: SyncAdAccountByNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncAdAccountByNotificationService,
        { provide: AdAccountRepository, useValue: {} },
        { provide: ThirdPartyNotificationApiService, useValue: {} },
        { provide: DataSynchronizationService, useValue: {} },
      ],
    }).compile();

    service = module.get<SyncAdAccountByNotificationService>(SyncAdAccountByNotificationService);
    service.fetchNotifications = jest.fn().mockReturnValue(of());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sync', () => {
    const adAccount = { lastSynced: new Date('2020-03-12') };
    const notifications = [{ createdAt: new Date('2020-03-13') }, { createdAt: new Date('2020-03-14') }];
    const shouldSyncAdAccount = service.shouldSyncAdAccount({ adAccount, notifications });
    expect(shouldSyncAdAccount).toBe(true);
  });

  it('should sync 2', () => {
    const adAccount = { lastSynced: null };
    const notifications = [];
    const shouldSyncAdAccount = service.shouldSyncAdAccount({ adAccount, notifications });
    expect(shouldSyncAdAccount).toBe(true);
  });

  it('should`t sync', () => {
    const adAccount = { lastSynced: new Date('2020-03-12') };
    const notifications = [{ createdAt: new Date('2020-03-11') }, { createdAt: new Date('2020-03-12') }];
    const shouldSyncAdAccount = service.shouldSyncAdAccount({ adAccount, notifications });
    expect(shouldSyncAdAccount).toBe(false);
  });

  it('should`t sync 2', () => {
    const adAccount = { lastSynced: new Date('2020-03-12') };
    const notifications = [];
    const shouldSyncAdAccount = service.shouldSyncAdAccount({ adAccount, notifications });
    expect(shouldSyncAdAccount).toBe(false);
  });
});
