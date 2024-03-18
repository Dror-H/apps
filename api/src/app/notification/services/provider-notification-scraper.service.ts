import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { Notification } from '@api/notification/data/notification.entity';
import { User } from '@api/user/data/user.entity';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { ThirdPartyNotificationApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { getRepository } from 'typeorm';

@Injectable()
export class ProviderNotificationScraperService {
  @Inject(ThirdPartyNotificationApiService)
  private readonly thirdPartyNotificationApiService: ThirdPartyNotificationApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  async scrapeFacebookNotification() {
    const adAccounts = await this.adAccountRepository.getAdAccountsByProvider({
      provider: SupportedProviders.FACEBOOK,
    });
    const promises = adAccounts.map((adAccount) =>
      this.fetchNotifications(adAccount)
        .pipe(
          switchMap((notifications) => this.upsertNotifications(adAccount, notifications)),
          catchError(() => EMPTY),
        )
        .toPromise(),
    );
    await Promise.all(promises).catch((e) => {
      console.error(e);
    });
    return 'Notification successfully fetched';
  }

  upsertNotifications(adAccount, notifications) {
    const mapped = notifications?.map((n) => ({
      ...n,
      workspace: adAccount.workspace,
      adAccount: adAccount,
    }));
    if (mapped?.length > 0) {
      return getRepository(Notification)
        .createQueryBuilder()
        .insert()
        .into(Notification)
        .values(mapped)
        .orIgnore()
        .execute();
    }
    return EMPTY;
  }

  fetchNotifications(adAccount) {
    const { accessToken } =
      plainToClass(User, adAccount.workspace.owner)?.getAccessToken({
        provider: adAccount.provider,
      }) || {};
    return this.thirdPartyNotificationApiService
      .notification({
        accessToken,
        id: [adAccount.providerId],
        provider: adAccount.provider,
      })
      .pipe(map((response) => response[adAccount.providerId]));
  }
}
