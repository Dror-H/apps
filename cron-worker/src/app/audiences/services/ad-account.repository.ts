import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'slonik';
import { DatabaseService } from '../../database/db.service';

@Injectable()
export class AdAccountRepository {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  public async getAllAccountsWithToken(): Promise<{ id: string; access_token: string }[]> {
    return (
      await this.databaseService.audiences.many<{ id: string; access_token: string }>(sql`
    SELECT DISTINCT ad_accounts.id,
    MAX(auth_tokens.access_token) as access_token
    from ad_accounts
    LEFT JOIN _ad_account_to_user on _ad_account_to_user."A" = ad_accounts.id
    LEFT JOIN users on _ad_account_to_user."B"=users.id
    LEFT JOIN auth_tokens on users.id = auth_tokens.user_id
    WHERE ad_accounts.synchronized is false
    GROUP BY ad_accounts.id;`)
    ).slice();
  }

  public async getAnyAdAccount(): Promise<{ id: string; access_token: string }[]> {
    const result = await this.databaseService.audiences.any<{ id: string; access_token: string }>(sql`
      SELECT DISTINCT ad_accounts.id,
      MAX(auth_tokens.access_token) as access_token,
      RANDOM()
      from ad_accounts
      LEFT JOIN _ad_account_to_user on _ad_account_to_user."A" = ad_accounts.id
      LEFT JOIN users on _ad_account_to_user."B"=users.id
      LEFT JOIN auth_tokens on users.id = auth_tokens.user_id
      WHERE ad_accounts.synchronized is false and ad_accounts.business_country_code = 'US' and ad_accounts.status = 'ACTIVE'
      GROUP BY ad_accounts.id order by RANDOM()
      LIMIT 1;`);
    return result.slice();
  }
}
