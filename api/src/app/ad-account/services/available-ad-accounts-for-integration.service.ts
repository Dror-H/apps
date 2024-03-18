import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import {
  AdAccountNotFoundException,
  PageNotFoundException,
  UnableToFetchAdAccountsException,
  UnauthorizedProviderTokenException,
} from '@instigo-app/api-shared';
import { AdAccountDTO, AvailableAdAccountsDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { ThirdPartyAdAccountApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable } from '@nestjs/common';
import to from 'await-to-js';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { getRepository, In } from 'typeorm';
import { AdAccountRepository } from '../data/ad-account.repository';
import { PageRepository } from '../data/page.repository';

@Injectable()
export class AvailableAdAccountsForIntegrationService {
  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(PageRepository)
  private readonly pageRepository: PageRepository;

  @Inject(ThirdPartyAdAccountApiService)
  private readonly thirdPartyAdAccountApiService: ThirdPartyAdAccountApiService;

  async getProviderAdAccounts(options: { accessToken: string; provider: SupportedProviders }): Promise<AdAccountDTO[]> {
    const { accessToken, provider } = options;
    return (await this.thirdPartyAdAccountApiService.findAll({ accessToken, provider })).map((adaccount) => ({
      ...adaccount,
      used: false,
    }));
  }

  markUsedAdAccount(adAccounts: {
    instigoAdAccounts: AdAccountDTO[];
    providerAdAccounts: AdAccountDTO[];
  }): AvailableAdAccountsDTO[] {
    const { instigoAdAccounts, providerAdAccounts } = adAccounts;
    const adAccountsIntersection = instigoAdAccounts
      .filter((instigoAdAccount) =>
        providerAdAccounts.some((providerAdAccount) => providerAdAccount.providerId === instigoAdAccount.providerId),
      )
      .map((adAccount) => ({ ...adAccount, used: !isEmpty(adAccount.workspace) }));

    const availableAdAccounts = providerAdAccounts.filter(
      (platformAdAccount) =>
        !instigoAdAccounts.some((instigoAdAccount) => platformAdAccount.providerId === instigoAdAccount.providerId),
    );
    return [...availableAdAccounts, ...adAccountsIntersection];
  }

  async getAccessToken(options: { user: Partial<User>; provider: SupportedProviders }): Promise<string> {
    const { user, provider } = options;
    const fullUser = await getRepository('users')
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.oAuthTokens', 'oAuthTokens')
      .where({ id: user.id })
      .getOne();
    const { accessToken } = plainToClass(User, fullUser).getAccessToken({ provider });
    return accessToken;
  }

  async getAvailableAdAccounts(options: {
    user: User;
    provider: SupportedProviders;
  }): Promise<AvailableAdAccountsDTO[]> {
    const { user, provider } = options;
    try {
      const accessToken = await this.getAccessToken({ user, provider });
      const providerAdAccounts = await this.getProviderAdAccounts({ accessToken, provider });
      const instigoAdAccounts = await this.adAccountRepository.find({
        where: { providerId: In(providerAdAccounts.map((account) => account.providerId)) },
        relations: ['workspace'],
      });
      return this.markUsedAdAccount({ instigoAdAccounts, providerAdAccounts });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.error?.status === 401 || error?.details?.status === 401 || error?.details?.status === 403) {
        throw new UnauthorizedProviderTokenException({ provider });
      }
      console.log('error :>> ', error);
      throw new UnableToFetchAdAccountsException({ email: user.email });
    }
  }

  async checkAdAccountTos(options: { workspace: Workspace; adAccountProviderId: string }): Promise<any> {
    const { workspace, adAccountProviderId } = options;
    const [adAccountErr, adAccount] = await to(
      this.adAccountRepository.findOneOrFail({ where: { providerId: adAccountProviderId } }),
    );
    if (adAccountErr) {
      throw new AdAccountNotFoundException({ providerId: adAccountProviderId });
    }
    const { accessToken } = workspace.owner.getAccessToken({ provider: adAccount.provider });
    return await this.thirdPartyAdAccountApiService.checkAdAccountTos({
      accessToken,
      adAccountId: adAccountProviderId,
      provider: adAccount.provider,
    });
  }

  async checkPageTos(options: {
    workspace: Workspace;
    pageProviderId: string;
  }): Promise<{ leadgen_tos_accepted: boolean }> {
    const { workspace, pageProviderId } = options;
    const [pageErr, page] = await to(this.pageRepository.findOneOrFail({ where: { providerId: pageProviderId } }));
    if (pageErr) {
      throw new PageNotFoundException({ providerId: pageProviderId });
    }
    const { accessToken } = workspace.owner.getAccessToken({ provider: page.type as any as SupportedProviders });
    return await this.thirdPartyAdAccountApiService.checkPageTos({
      accessToken: accessToken,
      pageId: page.providerId,
      provider: page.type as any as SupportedProviders,
    });
  }
}
