import { InvalidTokenStatusException, MissingOAuthTokenException } from '@instigo-app/api-shared';
import { Resources, SupportedProviders, TokenStatus } from '@instigo-app/data-transfer-object';
import { EntityRepository, Repository } from 'typeorm';
import { AdAccount } from './ad-account.entity';

@EntityRepository(AdAccount)
export class AdAccountRepository extends Repository<AdAccount> {
  public async findWithAccessToken(options: { id: string }) {
    const { id } = options;
    const resourceName = Resources.AD_ACCOUNTS;
    const adAccount = await this.createQueryBuilder(resourceName)
      .leftJoinAndSelect(`${resourceName}.workspace`, 'workspace')
      .leftJoinAndSelect('workspace.owner', 'owner')
      .leftJoinAndSelect('owner.oAuthTokens', 'token', `token.provider = ${resourceName}.provider`)
      .where(`${resourceName}.id = :id`, { id })
      .getOne();
    const oAuthToken = adAccount?.workspace?.owner?.oAuthTokens[0];
    if (!oAuthToken) {
      throw new MissingOAuthTokenException({ provider: adAccount?.provider });
    }
    if (oAuthToken.status !== TokenStatus.ACTIVE) {
      throw new InvalidTokenStatusException({
        status: oAuthToken.status,
        provider: adAccount.provider,
      });
    }
    return { ...adAccount, accessToken: oAuthToken.accessToken };
  }

  public async getAccessTokenByProviderId(options: { providerId: string }) {
    const { providerId } = options;
    const resourceName = Resources.AD_ACCOUNTS;
    const adAccount = await this.createQueryBuilder(resourceName)
      .leftJoinAndSelect(`${resourceName}.workspace`, 'workspace')
      .leftJoinAndSelect('workspace.owner', 'owner')
      .leftJoinAndSelect('owner.oAuthTokens', 'token', `token.provider = ${resourceName}.provider`)
      .where(`${resourceName}.providerId = :providerId`, { providerId })
      .getOne();
    const oAuthToken = adAccount?.workspace?.owner?.oAuthTokens[0];

    if (!oAuthToken) {
      throw new MissingOAuthTokenException({ provider: adAccount?.provider });
    }

    if (oAuthToken.status !== TokenStatus.ACTIVE) {
      throw new InvalidTokenStatusException({
        status: oAuthToken.status,
        provider: adAccount.provider,
      });
    }
    return { accessToken: oAuthToken?.accessToken };
  }

  getAdAccountsByProvider(options: { provider: SupportedProviders }) {
    return this.find({
      where: { provider: options.provider },
      select: ['id', 'provider', 'providerId'],
      join: {
        alias: 'adAccount',
        leftJoinAndSelect: {
          workspace: 'adAccount.workspace',
          owner: 'workspace.owner',
          oAuthTokens: 'owner.oAuthTokens',
        },
      },
    });
  }
}
