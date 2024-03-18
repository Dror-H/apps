import { ThirdPartyAdAccountApiService, ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/db.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sql } from 'slonik';
import { ProgressBar } from '@instigo-app/api-shared';
import { AdAccountDTO, SupportedProviders, TokenStatus } from '@instigo-app/data-transfer-object';
import PromisePool from '@supercharge/promise-pool';
import to from 'await-to-js';
export interface SyncUserAccount {
  id: string;
  accessToken: string;
}
@Injectable()
export class SyncAdAccountService {
  private readonly logger = new Logger(SyncAdAccountService.name);

  @Inject(ThirdPartyAdAccountApiService)
  private readonly thirdPartyAdAccountApiService: ThirdPartyAdAccountApiService;

  @Inject(ThirdPartyAuthApiService)
  private readonly thirdPartyAuthApiService: ThirdPartyAuthApiService;

  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Cron(CronExpression.EVERY_4_HOURS, { name: 'sync-ad-accounts-details' })
  async syncAllAccounts(): Promise<void> {
    this.logger.log('Sync all accounts');
    const access_tokens = await this.databaseService.audiences.many<SyncUserAccount>(
      sql`SELECT user_id as id, access_token as "accessToken" FROM auth_tokens;`,
    );
    this.logger.log(`Found ${access_tokens.length} access tokens to sync`);
    await this.syncAccountsSync(access_tokens.slice());
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sync-new-ad-accounts-details' })
  async syncNewAccounts(): Promise<void> {
    const [, access_tokens] = await to(
      this.databaseService.audiences.many<SyncUserAccount>(
        sql`SELECT user_id as id, access_token as "accessToken" FROM auth_tokens where created_at > now() - interval '5 minutes';`,
      ),
    );
    if (access_tokens && access_tokens.length > 0) {
      this.logger.log(`Found ${access_tokens.length} access tokens to sync`);
      await this.syncAccountsSync(access_tokens.slice());
    }
  }

  async syncAccountsSync(accounts: SyncUserAccount[]): Promise<void> {
    const progress = new ProgressBar({ total: accounts.length, identifier: 'sync-accounts' });
    const { errors } = await new PromisePool()
      .for(accounts)
      .withConcurrency(10)
      .process<any>(async (account) => {
        const status = await this.thirdPartyAuthApiService.inspectToken({
          provider: SupportedProviders.FACEBOOK,
          accessToken: account.accessToken,
        });
        if (status.status === TokenStatus.EXPIRED) {
          this.logger.log(`Token expired for user ${account.id}`);
          progress.tick();
          return;
        }
        const newAccounts = await this.thirdPartyAdAccountApiService.findAll({
          accessToken: account.accessToken,
          provider: SupportedProviders.FACEBOOK,
        });
        if (!newAccounts?.length) {
          progress.tick();
          return;
        }
        this.logger.log(`Found ${newAccounts.length} accounts for user ${account.id}`);
        const [err, result] = await to(this.upsertAdAccounts(newAccounts));
        if (err) {
          this.logger.error(err);
        }
        this.logger.log(`Upserted ${result.length} accounts for user ${account.id}`);
        await to(this.updateAdAccountsToUserTable(account.id, result));
        progress.tick();
      });
    if (errors && errors.length > 0) {
      this.logger.error(errors);
    }
  }

  async updateAdAccountsToUserTable(user_id: string, accounts: { id: string }[]): Promise<void> {
    const values = sql.join(
      accounts.map(({ id }) => sql`(${id}, ${user_id})`),
      sql`,`,
    );
    await this.databaseService.audiences.query(
      sql`
      INSERT INTO "public"."_ad_account_to_user" ("A", "B") VALUES ${values} ON CONFLICT DO NOTHING;`,
    );
  }

  async upsertAdAccounts(adAccounts: AdAccountDTO[]): Promise<any> {
    const toBeUpserted = sql.join(
      adAccounts.map(
        (adAccount) => sql`(
        ${adAccount.providerId},
        ${adAccount?.name ?? ''},
        ${adAccount?.provider ?? SupportedProviders.FACEBOOK},
        ${adAccount?.status},
        ${adAccount?.businessProfilePicture || ''},
        FALSE,
        ${new Date(adAccount?.createdAt).toISOString()},
        ${new Date().toISOString()},
        ${new Date().toISOString()},
        ${adAccount?.currency ?? ''},
        ${adAccount?.businessCity ?? ''},
        ${adAccount?.businessCountryCode ?? ''},
        ${adAccount?.businessName ?? ''},
        ${adAccount?.businessZip ?? ''},
        ${adAccount?.minDailyBudget?.minDailyBudgetImp || 0}
      )`,
      ),
      sql`,`,
    );
    return await this.databaseService.audiences.any<{ id: string }>(sql`
      INSERT INTO
        "public"."ad_accounts" (
          "id",
          "name",
          "provider",
          "status",
          "business_profile_picture",
          "synchronized",
          "created_at",
          "updated_at",
          "imported_at",
          "currency",
          "business_city",
          "business_country_code",
          "business_name",
          "business_zip",
          "min_daily_budget"
        )
      VALUES
        ${toBeUpserted} ON CONFLICT (id) DO
      UPDATE
      SET
        (
          name,
          provider,
          status,
          business_profile_picture,
          synchronized,
          created_at,
          updated_at,
          imported_at,
          currency,
          business_city,
          business_country_code,
          business_name,
          business_zip,
          min_daily_budget
        ) = (
          COALESCE(EXCLUDED.name, ad_accounts.name),
          COALESCE(EXCLUDED.provider, ad_accounts.provider),
          COALESCE(EXCLUDED.status, ad_accounts.status),
          COALESCE(
            EXCLUDED.business_profile_picture,
            ad_accounts.business_profile_picture
          ),
          COALESCE(EXCLUDED.synchronized, ad_accounts.synchronized),
          COALESCE(EXCLUDED.created_at, ad_accounts.created_at),
          COALESCE(EXCLUDED.updated_at, ad_accounts.updated_at),
          COALESCE(ad_accounts.imported_at,EXCLUDED.imported_at),
          COALESCE(EXCLUDED.currency, ad_accounts.currency),
          COALESCE(EXCLUDED.business_city, ad_accounts.business_city),
          COALESCE(
            EXCLUDED.business_country_code,
            ad_accounts.business_country_code
          ),
          COALESCE(EXCLUDED.business_name, ad_accounts.business_name),
          COALESCE(EXCLUDED.business_zip, ad_accounts.business_zip),
          COALESCE(
            EXCLUDED.min_daily_budget,
            ad_accounts.min_daily_budget
          )
        ) RETURNING id
    `);
  }
}
