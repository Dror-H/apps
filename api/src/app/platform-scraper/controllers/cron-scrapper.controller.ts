import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Inject, Post } from '@nestjs/common';
import { DataSynchronizationService } from '../services/datasync.service';
import { SyncAdAccountByNotificationService } from '../services/sync-ad-account-by-notification.service';

@CompositionDecorator({ resource: Resources.CRON_JOBS, useGuards: false })
export class CronScrapperController {
  @Inject(SyncAdAccountByNotificationService)
  private readonly syncAdAccountByNotificationService: SyncAdAccountByNotificationService;

  @Inject(DataSynchronizationService)
  private readonly dataSynchronizationService: DataSynchronizationService;

  @Post('check_facebook_adaccounts')
  checkFacebookAdAccounts() {
    void this.syncAdAccountByNotificationService.checkAdAccounts().then(() => {});
    return new ResponseSuccess('JOB STARTED');
  }

  @Post('auto_sync_workspaces')
  autoSyncWorkspaces() {
    void this.dataSynchronizationService.autoSyncWorkspaces().then(() => {});
    return new ResponseSuccess('JOB STARTED');
  }
}
