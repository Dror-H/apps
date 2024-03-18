import { Page } from '@api/ad-account/data/page.entity';
import { CreationException, StepFailure } from '@instigo-app/api-shared';
import { AdAccountDTO, PageDTO, Resources } from '@instigo-app/data-transfer-object';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { isEmpty } from 'lodash';
import { Connection, In, ObjectLiteral, Repository } from 'typeorm';
import { AdAccount } from '../data/ad-account.entity';

@Injectable()
export class AdAccountService {
  private readonly logger = new Logger(AdAccountService.name);

  constructor(@InjectConnection() private connection: Connection) {}

  @InjectRepository(AdAccount)
  private readonly adAccountRepository: Repository<AdAccount>;

  bulkCreate(adAccounts: Partial<AdAccountDTO[]>): Promise<AdAccountDTO[]> {
    return this.saveAdAccounts(adAccounts);
  }

  async deleteAdAccounts(adAccounts: Partial<AdAccount[]>): Promise<any> {
    adAccounts = await this.adAccountRepository.find({
      where: { providerId: In(adAccounts.map((a) => a.providerId)) },
    });
    const [error, result] = await to(this.adAccountRepository.remove(adAccounts));
    if (error) {
      this.logger.error(error);
      return {};
    }
    return result;
  }

  async insertAccount(account: Partial<AdAccountDTO>): Promise<ObjectLiteral> {
    const query = `INSERT INTO "ad_accounts" (
    "name",
    "provider",
    "providerId",
    "currency",
    "status",
    "businessId",
    "businessName",
    "businessProfilePicture",
    "workspaceId"
    ) VALUES
    ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )`;
    const [error] = await to(
      this.connection.manager.query(query, [
        account.name,
        account.provider,
        account.providerId,
        account.currency,
        account.status,
        account.businessId,
        account.businessName,
        account.businessProfilePicture,
        account.workspace.id,
      ]),
    );
    if (error) {
      this.logger.error(error);
      throw error;
    }
    const result = await this.connection
      .createQueryBuilder()
      .select()
      .from(AdAccount, Resources.AD_ACCOUNTS)
      .where({ providerId: account.providerId })
      .execute();
    return result[0];
  }

  async saveAdAccounts(adAccounts: Partial<AdAccountDTO[]>) {
    if (!isEmpty(adAccounts)) {
      const results = [];
      try {
        for await (const account of adAccounts) {
          const pages: PageDTO[] = account.pages || [];
          delete account.pages;
          const insertedAccount = (await this.insertAccount(account)) as any;
          for await (const page of pages) {
            const alreadySavedPage = await this.connection
              .createQueryBuilder(Page, Resources.PAGE)
              .select()
              .where({ providerId: page.providerId })
              .leftJoinAndSelect('pages.adAccounts', 'adAccounts')
              .getOne();

            if (alreadySavedPage) {
              await this.connection
                .createQueryBuilder(Page, Resources.PAGE)
                .relation(Resources.PAGE, 'adAccounts')
                .of(alreadySavedPage)
                .add(insertedAccount);
            } else {
              page.adAccounts = [insertedAccount] as any;
              await this.connection.createQueryBuilder().insert().into(Page).values(page).execute();
            }
          }
          const result = await this.connection
            .createQueryBuilder(AdAccount, Resources.AD_ACCOUNTS)
            .select()
            .where({ providerId: account.providerId })
            .leftJoinAndSelect('ad_accounts.pages', 'pages')
            .getOne();
          results.push(result);
        }
      } catch (error) {
        this.logger.error('Something went wrong during adding ad accounts');
        const res = await this.deleteAdAccounts(adAccounts as any);
        console.log(res);
        this.logger.error(error);
        throw new CreationException({
          provider: adAccounts[0].provider,
          stepFailure: StepFailure.AD_ACCOUNT,
          adAccount: {},
        });
      }
      return results;
    }
    return [];
  }
}
