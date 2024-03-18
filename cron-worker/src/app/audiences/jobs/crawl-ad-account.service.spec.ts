import { AdAccountRepository } from '../services/ad-account.repository';
import { TargetingHelperService } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { DatabaseService } from 'apps/cron-worker/src/app/database/db.service';
import { CrawlAdAccountService } from './crawl-ad-account.service';
import { HttpService } from '@nestjs/axios';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { TokenStatus } from '@instigo-app/data-transfer-object';
import { of } from 'rxjs';
import { PromisePoolError } from '@supercharge/promise-pool/dist';

describe('CrawlAdAccountService Test suite', () => {
  let service: CrawlAdAccountService;
  let adAccountRepository: AdAccountRepository;
  let thirdPartyAuthApiService: ThirdPartyAuthApiService;
  let targetingHelperService: TargetingHelperService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CrawlAdAccountService,
        {
          provide: HttpService,
          useValue: { get: () => of('test'), post: () => of('test') },
        },
        {
          provide: TargetingHelperService,
          useValue: { mapFacebookSpecToDBInsert: () => {} },
        },
        {
          provide: DatabaseService,
          useValue: { audiences: { query: async () => Promise.resolve() } },
        },
        {
          provide: ThirdPartyAuthApiService,
          useValue: { inspectToken: () => {} },
        },
        {
          provide: AdAccountRepository,
          useValue: { getAllAccountsWithToken: () => Promise.resolve([]) },
        },
      ],
    }).compile();

    service = module.get<CrawlAdAccountService>(CrawlAdAccountService);
    adAccountRepository = module.get(AdAccountRepository);
    thirdPartyAuthApiService = module.get(ThirdPartyAuthApiService);
    targetingHelperService = module.get(TargetingHelperService);
    databaseService = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockAccounts = [
    { id: '1', access_token: '123' },
    { id: '2', access_token: '456' },
  ];

  describe('syncAllAdACcounts', () => {
    it('should log accounts length', async () => {
      jest.spyOn(adAccountRepository, 'getAllAccountsWithToken').mockResolvedValue(mockAccounts);
      const spy = jest.spyOn((service as any).logger, 'log');
      await service.syncAllAdAccounts().then(() => {
        expect(spy).toBeCalledWith('Found 2 accounts');
      });
    });

    it('should call crawlAccounts with return from adAccountRepository.getAllAccountsWithToken', async () => {
      jest.spyOn(adAccountRepository, 'getAllAccountsWithToken').mockResolvedValue(mockAccounts);
      const spy = jest.spyOn(service as any, 'crawlAccounts');
      await service.syncAllAdAccounts().then(() => {
        expect(spy).toBeCalledWith(mockAccounts);
      });
    });
  });

  describe('crawlAccounts', () => {
    it('should set rates', async () => {
      jest.spyOn(service as any, 'getExchangeRates').mockResolvedValue('test');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(service.rates).toBe('test');
      });
    });

    it('should log found accounts count', async () => {
      const spy = jest.spyOn((service as any).logger, 'log');
      await service.crawlAccounts(mockAccounts).then(() => {
        expect(spy).toBeCalledWith(`Found ${mockAccounts.length} accounts to crawl`);
      });
    });

    it('should return on expired token', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.EXPIRED } as any);
      const spy = jest.spyOn(service as any, 'getAdSets');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).not.toBeCalled();
      });
    });

    it('should return on token status error', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockRejectedValue({ error: 'test' });
      const spy = jest.spyOn(service as any, 'getAdSets');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).not.toBeCalled();
      });
    });

    it('should return on falsy adsets', async () => {
      jest
        .spyOn(thirdPartyAuthApiService, 'inspectToken')
        .mockReturnValue(Promise.resolve({ status: TokenStatus.ACTIVE } as any));
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue(undefined);
      const spy = jest.spyOn(service as any, 'findAndSaveInsights');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).not.toBeCalled();
      });
    });

    it('should return on empty adsets', async () => {
      jest
        .spyOn(thirdPartyAuthApiService, 'inspectToken')
        .mockReturnValue(Promise.resolve({ status: TokenStatus.ACTIVE } as any));
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([]);
      const spy = jest.spyOn(service as any, 'findAndSaveInsights');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).not.toBeCalled();
      });
    });

    it('should return on adsets error', async () => {
      jest
        .spyOn(thirdPartyAuthApiService, 'inspectToken')
        .mockReturnValue(Promise.resolve({ status: TokenStatus.ACTIVE } as any));
      jest.spyOn(service as any, 'getAdSets').mockRejectedValue({ error: 'test' });
      const spy = jest.spyOn(service as any, 'findAndSaveInsights');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).not.toBeCalled();
      });
    });

    it('should log adsets error', async () => {
      jest
        .spyOn(thirdPartyAuthApiService, 'inspectToken')
        .mockReturnValue(Promise.resolve({ status: TokenStatus.ACTIVE } as any));
      jest.spyOn(service as any, 'getAdSets').mockRejectedValue({ error: 'test' });
      const spy = jest.spyOn((service as any).logger, 'error');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).toBeCalledWith('No adsets found for account 1');
      });
    });

    it('should call findAndSaveInsights', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      const spy = jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation();
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).toBeCalled();
      });
    });

    it('should log error on no specs found for account 1', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getTargetingFromFacebook').mockImplementation(() => Promise.reject('test'));
      const spy = jest.spyOn((service as any).logger, 'error');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy.mock.calls[0][0]).toBeInstanceOf(PromisePoolError);
        expect(spy.mock.calls[1][0]).toBe('Specs not found for account 1');
      });
    });

    it('should log specs found for account', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getTargetingFromFacebook').mockImplementation(() => Promise.resolve({ id: '1' }));
      const spy = jest.spyOn((service as any).logger, 'log');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).toBeCalledWith('Found 1 specs for account 1');
      });
    });

    it('should return on no toBeInserted length', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getTargetingFromFacebook').mockImplementation(() => Promise.resolve({ id: '1' }));
      jest.spyOn(targetingHelperService, 'mapFacebookSpecToDBInsert').mockReturnValue(undefined);
      const spy = jest.spyOn(databaseService.audiences, 'query');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).not.toBeCalled();
      });
    });

    it('should call databaseService.audiences.query', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getTargetingFromFacebook').mockImplementation(() => Promise.resolve({ id: '1' }));
      jest
        .spyOn(targetingHelperService, 'mapFacebookSpecToDBInsert')
        .mockReturnValue({ id: '1', spec: {}, segments: [], topics: [] });
      const spy = jest.spyOn(databaseService.audiences, 'query');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).toBeCalled();
      });
    });

    it('should log specSaveError', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getTargetingFromFacebook').mockImplementation(() => Promise.resolve({ id: '1' }));
      jest
        .spyOn(targetingHelperService, 'mapFacebookSpecToDBInsert')
        .mockReturnValue({ id: '1', spec: {}, segments: [], topics: [] });
      jest.spyOn(databaseService.audiences, 'query').mockRejectedValue('test');
      const spy = jest.spyOn((service as any).logger, 'error');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).toBeCalledWith('test');
      });
    });

    it('should log inserted count', async () => {
      jest.spyOn(thirdPartyAuthApiService, 'inspectToken').mockResolvedValue({ status: TokenStatus.ACTIVE } as any);
      jest.spyOn(service as any, 'getAdSets').mockResolvedValue([{ id: '1' }]);
      jest.spyOn(service as any, 'findAndSaveInsights').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getTargetingFromFacebook').mockImplementation(() => Promise.resolve({ id: '1' }));
      jest
        .spyOn(targetingHelperService, 'mapFacebookSpecToDBInsert')
        .mockReturnValue({ id: '1', spec: {}, segments: [], topics: [] });
      jest.spyOn(databaseService.audiences, 'query').mockResolvedValue({ rowCount: 1 } as any);
      const spy = jest.spyOn((service as any).logger, 'log');
      await service.crawlAccounts([mockAccounts[0]]).then(() => {
        expect(spy).toBeCalledWith('Saved 1 specs for account 1');
      });
    });
  });
});
