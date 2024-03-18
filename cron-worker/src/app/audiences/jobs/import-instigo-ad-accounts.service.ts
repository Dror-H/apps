import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sql } from 'slonik';
import { DatabaseService } from '../../database/db.service';
import { CrawlAdAccountService } from './crawl-ad-account.service';
const Cryptr = require('cryptr');
const secret = 'e41c966f21f9e1577802463f8924e6a3';
const cryptr = new Cryptr(secret);

@Injectable()
export class ImportInstigoAdAccountsService {
  @Inject(CrawlAdAccountService)
  private readonly crawlAdAccountService: CrawlAdAccountService;

  @Inject(DatabaseService)
  private readonly db: DatabaseService;

  @Cron(CronExpression.EVERY_DAY_AT_5AM, { name: 'import-instigo-accounts' })
  async importAccounts(): Promise<void> {
    const { rows } = await this.db.instigo.query<{ id: string; access_token: string }>(sql`
    SELECT ad_accounts."providerId" as id, oauth_tokens_accesstokens."accessToken" as access_token
    FROM ad_accounts
    LEFT JOIN workspaces on ad_accounts."workspaceId"=workspaces.id
    LEFT JOIN users on workspaces."ownerId"=users.id
    LEFT JOIN oauth_tokens_accesstokens on oauth_tokens_accesstokens."userId" = users.id
    WHERE ad_accounts.provider = 'facebook' and  oauth_tokens_accesstokens.provider='facebook';
    `);
    const accounts = rows.map(({ id, access_token }) => ({
      id,
      access_token: cryptr.decrypt(access_token),
    }));
    await this.crawlAdAccountService.crawlAccounts(accounts);
  }
}
