import { CacheTtlSeconds } from '@instigo-app/data-transfer-object';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { Cache } from 'cache-manager';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  async exchangeRates(options: { currency?: string }): Promise<{ [key: string]: number }> {
    const { currency = 'USD' } = options;
    const cacheKey = `rates-${JSON.stringify({
      date: format(new Date(), 'yyyy-MM-dd'),
    })}`;
    const cachedRates = await this.cacheManager.get<{ [key: string]: number }>(cacheKey);
    if (cachedRates) {
      return cachedRates;
    }
    const [err, rates] = await to(this.getExchangeRates({ base: currency }).toPromise());
    if (err) {
      this.logger.error(err);
      return {};
    }
    await this.cacheManager.set(cacheKey, rates, { ttl: CacheTtlSeconds.ONE_DAY });
    return rates;
  }

  exchangeAmount({ amount, from, rates }) {
    return Number((amount / rates[from]).toFixed(4));
  }

  private getExchangeRates(options?: { base?: string }): Observable<{ [key: string]: number }> {
    const base = options?.base || 'USD';
    return this.httpService.get(`https://v6.exchangerate-api.com/v6/b61277dbb070581f3675590d/latest/${base}`).pipe(
      share(),
      map((response) => ({ ...response.data['conversion_rates'], [base]: 1 })),
    );
  }
}
