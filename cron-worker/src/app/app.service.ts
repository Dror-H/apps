import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { AddToTargetingsSegmentsRelatedWordsService } from './audiences/jobs/add_to_targetings_segements_related_words.service';
import { CrawlAdAccountService } from './audiences/jobs/crawl-ad-account.service';
import { ImportInstigoAdAccountsService } from './audiences/jobs/import-instigo-ad-accounts.service';
import { SeedSegmentsService } from './audiences/jobs/seed-segments.service';
import { SyncAdAccountService } from './audiences/jobs/sync-ad-account.service';
import { SyncUserSubscriptionService } from './audiences/jobs/sync-user-subscription.service';

@Injectable()
export class AppService implements OnModuleInit {
  @Inject(SyncAdAccountService)
  private readonly syncAdAccountService: SyncAdAccountService;

  @Inject(SyncUserSubscriptionService)
  private readonly syncUserSubscription: SyncUserSubscriptionService;

  @Inject(CrawlAdAccountService)
  private readonly crawlAdAccountService: CrawlAdAccountService;

  @Inject(AddToTargetingsSegmentsRelatedWordsService)
  private readonly addToTargetingsSegmentsRelatedWordsService: AddToTargetingsSegmentsRelatedWordsService;

  @Inject(SeedSegmentsService)
  private readonly seedSegmentsService: SeedSegmentsService;

  @Inject(ImportInstigoAdAccountsService)
  private readonly importInstigoAdAccountsService: ImportInstigoAdAccountsService;

  constructor(private schedulerRegistry: SchedulerRegistry) {}
  private readonly logger = new Logger('AppService');

  onModuleInit(): void {
    setTimeout(() => {
      // void this.syncAdAccountService.syncAllAccounts().then().catch(console.error);
      // void this.crawlAdAccountService.syncAllAdAccounts().then().catch(console.error);
      // void this.addToTargetingsSegmentsRelatedWordsService.addRelatedWords().then().catch(console.error);
      // void this.syncUserSubscription.syncUserSubscription();
      // void this.seedSegmentsService.seed();
      // void this.seedSegmentsService.refreshSegments();
      // void this.importInstigoAdAccountsService.importAccounts();
    }, 5000);
    setTimeout(() => {
      const jobs = this.schedulerRegistry.getCronJobs();
      jobs.forEach((job, key) => {
        let next;
        try {
          next = job.nextDates().toDate();
        } catch (e) {
          next = 'error: next fire date is in the past!';
        }
        this.logger.log(`job: ${key} -> next: ${next}`);
      });
    }, 500);
  }

  triggerJob(key: string): string {
    const CronTime = require('cron').CronTime;
    const job = this.schedulerRegistry.getCronJob(key);
    if (!job) {
      throw new Error(`job: ${key} not found`);
    }
    job.setTime(new CronTime(CronExpression.EVERY_SECOND));
    job.start();
    setTimeout(() => {
      job.stop();
    }, 1500);
    return 'Job Started';
  }
}
