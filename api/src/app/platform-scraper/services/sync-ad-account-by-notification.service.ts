import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { Notification } from '@api/notification/data/notification.entity';
import { DataSynchronizationService } from '@api/platform-scraper/services/datasync.service';
import { User } from '@api/user/data/user.entity';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { ThirdPartyNotificationApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class SyncAdAccountByNotificationService {
  @Inject(ThirdPartyNotificationApiService)
  private readonly thirdPartyNotificationApiService: ThirdPartyNotificationApiService;

  @Inject(DataSynchronizationService)
  private readonly dataSynchronizationService: DataSynchronizationService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  async checkAdAccounts() {
    const adAccounts = await this.adAccountRepository.getAdAccountsByProvider({
      provider: SupportedProviders.FACEBOOK,
    });
    return await new PromisePool().for(adAccounts).process(async (adAccount) => {
      const notifications = await this.fetchNotifications(adAccount).toPromise();
      const shouldSyncAdAccount = this.shouldSyncAdAccount({ adAccount, notifications });
      if (shouldSyncAdAccount) {
        return this.dataSynchronizationService.syncAdAccount({ adAccount });
      }
    });
  }

  shouldSyncAdAccount(options: { adAccount: Partial<AdAccount>; notifications: Partial<Notification>[] }): boolean {
    const { adAccount, notifications } = options;
    if (!adAccount?.lastSynced) return true;
    return notifications.some((notification) => notification?.createdAt > adAccount?.lastSynced);
  }

  fetchNotifications(adAccount: Partial<AdAccount>): Observable<any> {
    const { accessToken = null } = plainToClass(User, adAccount.workspace.owner).getAccessToken({
      provider: adAccount.provider,
    });
    if (!accessToken) return of([]);
    return this.thirdPartyNotificationApiService
      .notification({
        accessToken,
        id: [adAccount.providerId],
        provider: adAccount.provider,
      })
      .pipe(map((response) => response[adAccount.providerId]));
  }
}
