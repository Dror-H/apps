import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';
import { getRedisMockClient } from './mock-redis';

class MockBullConfigService implements BullOptionsFactory {
  createBullOptions(): BullModuleOptions {
    return {
      createClient: () => getRedisMockClient() as any,
    };
  }
}

export const mockRedis = new MockBullConfigService();
