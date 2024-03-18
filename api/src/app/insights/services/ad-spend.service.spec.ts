import { Test } from '@nestjs/testing';
import { AdSpendService } from './ad-spend.service';

describe('AdSpendService Test suite', () => {
  let adSpendService: AdSpendService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        AdSpendService,
        {
          provide: 'ExchangeRateService',
          useValue: {
            exchangeAmount: ({ amount, from, rates }) => Number((amount / rates[from]).toFixed(4)),
            exchangeRates: jest.fn().mockResolvedValue({
              USD: 1,
              EUR: 0.8523,
              RON: 4.2209,
            }),
          },
        },
      ],
    }).compile();

    adSpendService = module.get<AdSpendService>(AdSpendService);
  });

  it('should be defined', () => {
    expect(adSpendService).toBeDefined();
  });

  it('should convert to usd all ad-account totals', async () => {
    const data = [
      {
        workspace_id: '336f821a-9217-46bb-9e7a-e7ca9e8f3036',
        ad_account_id: '507023458',
        currency: 'EUR',
        spend: '100.00',
      },
      {
        workspace_id: '336f821a-9217-46bb-9e7a-e7ca9e8f3036',
        ad_account_id: '507023458',
        currency: 'USD',
        spend: '346.00',
      },
      {
        workspace_id: '336f821a-9217-46bb-9e7a-e7ca9e8f3036',
        ad_account_id: '507023458',
        currency: 'RON',
        spend: '34600',
      },
    ];
    const total = await (adSpendService as any).getTotalSpendInUsd({ breakdown: data });
    expect(total).toEqual(8660.6335);
  });
});
