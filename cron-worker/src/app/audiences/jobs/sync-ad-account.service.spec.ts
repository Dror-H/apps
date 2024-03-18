import { DatabaseService } from 'apps/cron-worker/src/app/database/db.service';
import { SupportedProviders, TokenStatus } from '@instigo-app/data-transfer-object';
import { ThirdPartyAdAccountApiService, ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { SyncAdAccountService } from './sync-ad-account.service';

describe('SyncAdAccountService Test suite', () => {
  let service: SyncAdAccountService;
  let thirdPartyAuthApiService: ThirdPartyAuthApiService;
  let thirdPartyAdAccountApiService: ThirdPartyAdAccountApiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SyncAdAccountService,
        {
          provide: HttpService,
          useValue: { get: () => of('test'), post: () => of('test') },
        },
        {
          provide: ThirdPartyAdAccountApiService,
          useValue: { mapFacebookSpecToDBInsert: () => {}, findAll: () => {} },
        },
        {
          provide: ThirdPartyAuthApiService,
          useValue: { inspectToken: () => {} },
        },
        { provide: DatabaseService, useValue: { audiences: { many: () => {} } } },
      ],
    }).compile();

    service = module.get<SyncAdAccountService>(SyncAdAccountService);
    thirdPartyAuthApiService = module.get(ThirdPartyAuthApiService);
    thirdPartyAdAccountApiService = module.get(ThirdPartyAdAccountApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncAccountsSync', () => {
    it('should log and return on expired token', async () => {
      jest
        .spyOn(thirdPartyAuthApiService, 'inspectToken')
        .mockImplementation(() => Promise.resolve({ status: TokenStatus.EXPIRED } as any));
      const loggerSpy = jest.spyOn((service as any).logger, 'log');
      const spy = jest.spyOn(service, 'upsertAdAccounts');
      await service.syncAccountsSync([{ id: '1', accessToken: '123' }]).then(() => {
        expect(loggerSpy).toBeCalledWith('Token expired for user 1');
        expect(spy).not.toBeCalled();
      });
    });

    it('should log upsert err', async () => {
      jest
        .spyOn(thirdPartyAuthApiService, 'inspectToken')
        .mockImplementation(() => Promise.resolve({ status: TokenStatus.ACTIVE } as any));
      jest.spyOn(thirdPartyAdAccountApiService, 'findAll').mockResolvedValue(['test'] as any);
      const loggerSpy = jest.spyOn((service as any).logger, 'error');
      const spy = jest.spyOn(service, 'upsertAdAccounts').mockImplementation(() => Promise.reject('test'));
      await service.syncAccountsSync([{ id: '1', accessToken: '123' }]).then(() => {
        expect(spy).toBeCalled();
        expect(loggerSpy).toBeCalledWith('test');
      });
    });
  });

  it('should updateAdAccountsToUserTable', async () => {
    jest
      .spyOn(thirdPartyAuthApiService, 'inspectToken')
      .mockImplementation(() => Promise.resolve({ status: TokenStatus.ACTIVE } as any));
    jest.spyOn(thirdPartyAdAccountApiService, 'findAll').mockResolvedValue(['test'] as any);
    const loggerSpy = jest.spyOn((service as any).logger, 'log');
    jest.spyOn(service, 'upsertAdAccounts').mockResolvedValue(['test']);
    const spy = jest.spyOn(service, 'updateAdAccountsToUserTable');
    await service.syncAccountsSync([{ id: '1', accessToken: '123' }]).then(() => {
      expect(spy).toBeCalledWith('1', ['test']);
      expect(loggerSpy).toHaveBeenLastCalledWith('Upserted 1 accounts for user 1');
    });
  });
});
