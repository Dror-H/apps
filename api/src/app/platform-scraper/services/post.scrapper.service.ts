import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { Page } from '@api/ad-account/data/page.entity';
import { PostRepository } from '@api/post/data/post.repository';
import {
  PostDTO,
  QueueNames,
  QueueProcessNames,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyPostApiService } from '@instigo-app/third-party-connector';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { Job } from 'bull';
import { flatten, isEmpty, isUndefined } from 'lodash';
import { getRepository, In } from 'typeorm';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
@Processor(QueueNames.POSTS)
export class PostScrapperService {
  private readonly logger = new Logger(PostScrapperService.name);

  @Inject(ThirdPartyPostApiService)
  private readonly thirdPostApiService: ThirdPartyPostApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(PostRepository)
  private readonly postRepository: PostRepository;

  @Process(QueueProcessNames.FETCH_POSTS)
  async fetchPosts(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const posts = await this.fetchPostsFromThirdParty(adAccount);
      if (isEmpty(posts)) {
        return `0 Posts successfully fetched for ${adAccount.name}`;
      }
      const { provider } = adAccount;
      await this.syncPosts(provider, adAccount, posts);
      const created = await this.postRepository.save(posts);
      return `${created.length} Posts successfully fetched for ${adAccount.name}`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async syncPosts(provider: SupportedProviders, adAccount: AdAccount, posts: PostDTO[] = []): Promise<void> {
    const providerIds = posts.map(({ providerId }) => providerId).filter((providerId) => !isUndefined(providerId));
    if (providerIds.length > 0) {
      const fetchedPostIds = (
        await this.postRepository
          .createQueryBuilder('posts')
          .select(`posts.providerId`)
          .innerJoin('posts.page', 'postPage')
          .innerJoin(`postPage.adAccounts`, `adAccount`, `adAccount.id = :adAccountId`, {
            adAccountId: adAccount.id,
          })
          .getMany()
      ).map((post) => post.providerId);
      const idsDiff: string[] = fetchedPostIds.filter((id: string) => !providerIds.includes(id));
      await this.postRepository
        .createQueryBuilder(Resources.POSTS)
        .delete()
        .where({ provider, providerId: In(idsDiff) })
        .execute();
    }
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_POSTS })
  onCompleted(job: Job<any>) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`);
  }

  private async fetchPostsFromThirdParty(adAccount: AdAccount): Promise<PostDTO[]> {
    const { provider } = adAccount;
    if (adAccount.provider === SupportedProviders.FACEBOOK) {
      const pages = await getRepository(Page)
        .createQueryBuilder('page')
        .leftJoin('page.adAccounts', 'adAccount')
        .where('adAccount.id = :id', { id: adAccount.id })
        .getMany();

      const { results } = await PromisePool.for(pages)
        .withConcurrency(5)
        .process(async (page: Page) => {
          if (page.accessToken) {
            const [error, posts] = await to<PostDTO[]>(
              this.thirdPostApiService.findAll({
                provider,
                accessToken: page.accessToken,
                adAccountBusinessId: page.providerId,
              }),
            );
            if (error) {
              this.logger.log(`Couldn't fetch posts for page with id: ${page.providerId} and name: ${page.name}`);
              return [];
            }
            posts.map((leadgenForm) => (leadgenForm.page = page));
            return posts;
          } else {
            return [];
          }
        });
      return flatten(results);
    }

    const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    return (
      await this.thirdPostApiService.findAll({
        provider,
        accessToken,
        adAccountBusinessId: adAccount.businessId,
      })
    ).map((post: PostDTO) => ({
      adAccounts: [adAccount],
      ...post,
    }));
  }
}
