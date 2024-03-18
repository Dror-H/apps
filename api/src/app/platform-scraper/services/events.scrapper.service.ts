import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { Page } from '@api/ad-account/data/page.entity';
import { EventsRepository } from '@api/events/data/events.repository';
import { EventsDTO, QueueNames, QueueProcessNames } from '@instigo-app/data-transfer-object';
import { ThirdPartyEventsApiService } from '@instigo-app/third-party-connector';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { Job } from 'bull';
import { flatten, isEmpty } from 'lodash';
import { getRepository } from 'typeorm';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
@Processor(QueueNames.EVENTS)
export class EventsScrapperService {
  private readonly logger = new Logger(EventsScrapperService.name);

  @Inject(ThirdPartyEventsApiService)
  private readonly thirdPartyEventsApiService: ThirdPartyEventsApiService;

  @Inject(EventsRepository)
  private readonly eventsRepository: EventsRepository;

  @Process(QueueProcessNames.FETCH_EVENTS)
  async fetchEvents(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const events = await this.fetchEventsFromThirdParty(adAccount);
      if (isEmpty(events)) {
        return `0 Events fetched for ${adAccount.name}`;
      }
      const created = await this.eventsRepository.save(events);
      return `${created.length} events fetched for ${adAccount.name}`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_EVENTS })
  onCompleted(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`);
  }

  private async fetchEventsFromThirdParty(adAccount: AdAccount): Promise<EventsDTO[]> {
    const pages = await getRepository(Page)
      .createQueryBuilder('page')
      .leftJoin('page.adAccounts', 'adAccount')
      .where('adAccount.id = :id', { id: adAccount.id })
      .getMany();
    const { results } = await PromisePool.for(pages)
      .withConcurrency(5)
      .process(async (page: Page) => {
        if (page.accessToken) {
          const [error, events] = await to<EventsDTO[]>(
            this.thirdPartyEventsApiService.findAll({
              provider: adAccount.provider,
              accessToken: page.accessToken,
              pageId: page.providerId,
            }),
          );
          if (error) {
            this.logger.log(`Couldn't fetch events for page with id: ${page.providerId} and name: ${page.name}`);
            return [];
          }
          events.map((event) => (event.page = page));
          return events;
        } else {
          return [];
        }
      });

    return flatten(results);
  }
}
