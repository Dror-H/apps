import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HttpCronService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Cron(CronExpression.EVERY_HOUR)
  async checkFacebookAdAccounts(): Promise<void> {
    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/check_facebook_adaccount').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/check_facebook_adaccount').toPromise();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async autoSyncWorkspaces(): Promise<void> {
    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/auto_sync_workspaces').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/auto_sync_workspaces').toPromise();
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async crons(): Promise<void> {
    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/inspect_user_account').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/inspect_user_account').toPromise();

    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/check_account_cost_cap').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/check_account_cost_cap').toPromise();

    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/refresh_tokens').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/refresh_tokens').toPromise();

    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/inspect_tokens').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/inspect_tokens').toPromise();
  }

  @Cron('0 0-23/1 * * *')
  async syncNotifications(): Promise<void> {
    await this.httpService.get('https://app-api-staging.instigo.io/cron_jobs/facebook_notifications').toPromise();
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/facebook_notifications').toPromise();
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async reportUsers(): Promise<void> {
    await this.httpService.get('https://app-api.instigo.io/cron_jobs/report_users').toPromise();
  }
}
