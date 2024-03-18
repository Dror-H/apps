import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { Page } from '@api/ad-account/data/page.entity';
import { LeadgenFormRepository } from '@api/leadgen-form/data/leadgen_form.repository';
import { LeadgenFormDTO, QueueNames, QueueProcessNames } from '@instigo-app/data-transfer-object';
import { ThirdPartyLeadgenFormApiService } from '@instigo-app/third-party-connector';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { Job } from 'bull';
import { flatten, isEmpty } from 'lodash';
import { getRepository } from 'typeorm';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
@Processor(QueueNames.LEADGEN_FORM)
export class LeadgenFormScrapperService {
  private readonly logger = new Logger(LeadgenFormScrapperService.name);

  @Inject(ThirdPartyLeadgenFormApiService)
  private readonly thirdPartyLeadgenFormApiService: ThirdPartyLeadgenFormApiService;

  @Inject(LeadgenFormRepository)
  private readonly leadgenFormRepository: LeadgenFormRepository;

  @Process(QueueProcessNames.FETCH_LEADGEN_FORMS)
  async fetchLeadgenForms(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const leadgenForms = await this.fetchLeadgenFormsFromThirdParty(adAccount);
      if (isEmpty(leadgenForms)) {
        return `0 Leadgen forms successfully fetched for ${adAccount.name}`;
      }
      const created = await this.leadgenFormRepository.save(leadgenForms);
      return `${created.length} Leadgen forms successfully fetched for ${adAccount.name}`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_LEADGEN_FORMS })
  onCompleted(job: Job<any>) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`);
  }

  private async fetchLeadgenFormsFromThirdParty(adAccount: AdAccount): Promise<LeadgenFormDTO[]> {
    const pages = await getRepository(Page)
      .createQueryBuilder('page')
      .leftJoin('page.adAccounts', 'adAccount')
      .where('adAccount.id = :id', { id: adAccount.id })
      .getMany();

    const { results } = await PromisePool.for(pages)
      .withConcurrency(5)
      .process(async (page: Page) => {
        if (page.accessToken) {
          const [error, leadgenForms] = await to<LeadgenFormDTO[]>(
            this.thirdPartyLeadgenFormApiService.findAll({
              provider: adAccount.provider,
              accessToken: page.accessToken,
              pageId: page.providerId,
            }),
          );
          if (error) {
            this.logger.log(`Couldn't fetch leadgen forms for page with id: ${page.providerId} and name: ${page.name}`);
            return [];
          }
          leadgenForms.map((leadgenForm) => (leadgenForm.page = page));
          return leadgenForms;
        } else {
          return [];
        }
      });

    return flatten(results);
  }
}
