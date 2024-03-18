import { QueueNames } from '@instigo-app/data-transfer-object';
import { BullModule, BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements BullOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createBullOptions(): BullModuleOptions {
    return {
      redis: this.configService.get('REDIS_URL'),
    };
  }
}

const BullQueueModule = BullModule.registerQueueAsync(
  {
    name: QueueNames.CAMPAIGNS,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.AUDIENCES,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.ADSETS,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.ADS,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.AD_ACCOUNT,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.AUTH,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.POSTS,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.LEADGEN_FORM,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.EVENTS,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.SET_ACTION_TYPE_FILED,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.CRON_JOBS,
    useClass: BullConfigService,
  },
  {
    name: QueueNames.FILES,
    useClass: BullConfigService,
  },
);

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [BullQueueModule],
  providers: [BullConfigService],
  exports: [BullQueueModule],
})
export class QueueModule {}
