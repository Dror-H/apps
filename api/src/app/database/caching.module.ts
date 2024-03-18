import { CacheTtlSeconds } from '@instigo-app/data-transfer-object';
import { CacheModule, CacheModuleOptions, CacheOptionsFactory, Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      url: this.configService.get('REDIS_URL'),
      ttl: CacheTtlSeconds.ONE_MINUTE,
    };
  }
}

const CacheStoreModule = CacheModule.registerAsync({
  useClass: CacheConfigService,
});

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [CacheStoreModule],
  providers: [CacheConfigService],
  exports: [CacheStoreModule],
})
export class CachingModule {}
