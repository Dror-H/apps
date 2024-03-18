import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRate Test suite', () => {
  let exchangeRateService: ExchangeRateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        ExchangeRateService,
        {
          provide: 'HttpService',
          useValue: {
            get: () =>
              of({
                data: {
                  result: 'success',
                  base_code: 'USD',
                  conversion_rates: {
                    USD: 1,
                  },
                },
              }),
          },
        },
        { provide: CACHE_MANAGER, useValue: { get: () => null, set: (k, v) => 'OK' } },
      ],
    }).compile();

    exchangeRateService = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(exchangeRateService).toBeDefined();
  });
  it('should return rates defined', async () => {
    const rates = await exchangeRateService.exchangeRates({ currency: 'EUR' });
    expect(rates).toBeDefined();
  });
});
