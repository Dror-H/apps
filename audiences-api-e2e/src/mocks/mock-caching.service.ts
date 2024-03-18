import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/common';
import { getRedisMockClient } from './mock-redis';

class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      createClient: () => getRedisMockClient(),
    };
  }
}

export const mockCaching = new CacheConfigService();
