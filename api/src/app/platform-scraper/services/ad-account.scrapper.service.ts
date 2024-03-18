import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { Page } from '@api/ad-account/data/page.entity';
import { PageRepository } from '@api/ad-account/data/page.repository';
import { AdAccountDTO, PageDTO, QueueNames, QueueProcessNames } from '@instigo-app/data-transfer-object';
import { ThirdPartyAdAccountApiService } from '@instigo-app/third-party-connector';
import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { remove } from 'lodash';
import { getRepository } from 'typeorm';

@Injectable()
@Processor(QueueNames.AD_ACCOUNT)
export class AdAccountScrapperService {
  private readonly logger = new Logger(AdAccountScrapperService.name);

  @Inject(ThirdPartyAdAccountApiService)
  private readonly thirdPartyAdAccountApiService: ThirdPartyAdAccountApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(PageRepository)
  private readonly pageRepository: PageRepository;

  constructor(
    @InjectQueue(QueueNames.POSTS) private readonly postsQueue: Queue,
    @InjectQueue(QueueNames.LEADGEN_FORM) private readonly leadFormsQueue: Queue,
    @InjectQueue(QueueNames.EVENTS) private readonly eventsQueue: Queue,
    @InjectQueue(QueueNames.FILES) private readonly filesQueue: Queue,
  ) {}

  @Process(QueueProcessNames.FETCH_AD_ACCOUNT)
  async fetchAdAccount(job: Job<{ adAccount: AdAccount }>) {
    // TODO: handle deleted adaccounts
    const { data } = job;
    const { adAccount } = data;
    const { provider } = adAccount;
    const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    const fetchedAdAccount = await this.thirdPartyAdAccountApiService.findOne({
      accessToken,
      adAccountId: adAccount.providerId,
      provider,
    });
    fetchedAdAccount.id = adAccount.id;
    await this.syncPagesForAdAccount(fetchedAdAccount);
    delete fetchedAdAccount.pages;
    delete adAccount.pages;
    const updated = await this.adAccountRepository.save({ ...adAccount, ...fetchedAdAccount });
    this.logger.log(`sync ${updated.name}_${updated.providerId}`);
    return;
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_AD_ACCOUNT })
  async onCompleted(job: Job): Promise<void> {
    return await this.startDependentQueues(job);
  }

  private async startDependentQueues(job: Job<{ adAccount: AdAccount }>): Promise<void> {
    const { data } = job;
    const { adAccount } = data;
    await this.postsQueue.add(QueueProcessNames.FETCH_POSTS, { adAccount }).catch((e) => {
      console.error(e);
    });
    await this.leadFormsQueue.add(QueueProcessNames.FETCH_LEADGEN_FORMS, { adAccount }).catch((e) => {
      console.error(e);
    });
    await this.eventsQueue.add(QueueProcessNames.FETCH_EVENTS, { adAccount }).catch((e) => {
      console.error(e);
    });
    await this.filesQueue.add(QueueProcessNames.FETCH_IMAGES, { adAccount }).catch((e) => {
      console.error(e);
    });
  }

  async syncPagesForAdAccount(adAccount: AdAccountDTO): Promise<void> {
    const fromFacebookPages: PageDTO[] = adAccount.pages;
    const adAccountPages = await getRepository(Page)
      .createQueryBuilder('page')
      .leftJoin('page.adAccounts', 'adAccount')
      .where('adAccount.id = :id', { id: adAccount.id })
      .getMany();
    const newPages = remove(
      fromFacebookPages,
      (page) => !adAccountPages.find((adAccountPage) => page.providerId === adAccountPage.providerId),
    );
    const toBeRemovedPages = remove(
      adAccountPages,
      (page) => !fromFacebookPages.find((adAccountPage) => page.providerId === adAccountPage.providerId),
    );
    await this.saveNewPagesOrBindAdAccount(newPages, adAccount);
    await this.removeThePageOrTheBindOfAdAccount(toBeRemovedPages, adAccount);
    await this.updateExistingPages(fromFacebookPages);
  }

  async saveNewPagesOrBindAdAccount(newPages: PageDTO[], adAccount: AdAccountDTO): Promise<void> {
    for (const page of newPages) {
      const alreadySavedPage = await this.pageRepository.findOne(
        { providerId: page.providerId },
        { relations: ['adAccounts'] },
      );
      if (alreadySavedPage) {
        this.setPageWithNewValues(alreadySavedPage, page);
        alreadySavedPage.adAccounts.push(adAccount as AdAccount);
        await this.pageRepository.save(alreadySavedPage);
      } else {
        page.adAccounts = [adAccount];
        await this.pageRepository.save(page);
      }
    }
  }

  async removeThePageOrTheBindOfAdAccount(toBeRemovedPages: PageDTO[], adAccount: AdAccountDTO): Promise<void> {
    for (const page of toBeRemovedPages) {
      const alreadySavedPage = await this.pageRepository.findOne(
        { providerId: page.providerId },
        { relations: ['adAccounts'] },
      );
      if (alreadySavedPage.adAccounts.length > 1) {
        remove(alreadySavedPage.adAccounts, (adAccountFromPage) => adAccountFromPage.id === adAccount.id);
        await this.pageRepository.save(alreadySavedPage);
      } else {
        await this.pageRepository.delete(page);
      }
    }
  }

  async updateExistingPages(newPages: PageDTO[]): Promise<void> {
    for (const page of newPages) {
      const alreadySavedPage = await this.pageRepository.findOne(
        { providerId: page.providerId },
        { relations: ['adAccounts'] },
      );
      if (alreadySavedPage) {
        this.setPageWithNewValues(alreadySavedPage, page);
        await this.pageRepository.save(alreadySavedPage);
      }
    }
  }

  private setPageWithNewValues(alreadySavedPage: Page, newPage: PageDTO): void {
    alreadySavedPage.name = newPage.name;
    alreadySavedPage.picture = newPage.picture;
    alreadySavedPage.fanCount = newPage.fanCount;
    alreadySavedPage.link = newPage.link;
    alreadySavedPage.about = newPage.about;
    alreadySavedPage.accessToken = newPage.accessToken;
  }
}
