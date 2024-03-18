import { PrettyLinkService } from '@instigo-app/api-shared';
import {
  AudienceDto,
  AudienceListInvalidItem,
  AudienceListUpdateOutput,
  MAX_AUDIENCE_LIST_SIZE,
  QueueNames,
  QueueProcessNames,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAudienceApiService } from '@instigo-app/third-party-connector';
import { DmpListActions } from '@instigo-app/third-party-connector/linkedin';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { OnQueueCompleted, OnQueueFailed, OnQueueRemoved, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { chunk, isEmpty, isUndefined, snakeCase, upperFirst } from 'lodash';
import { parse, unparse } from 'papaparse';
import { In, Not } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';
import { AdAccount } from '../../ad-account/data/ad-account.entity';
import { AdAccountRepository } from '../../ad-account/data/ad-account.repository';
import { Audience } from '../../audience/data/audience.entity';
import { AudienceRepository } from '../../audience/data/audience.repository';
import { File } from '../../file-manager/data/file.entity';
import { FileNestCrudService } from '../../file-manager/services/file.nestcrud.service';
import { User } from '../../user/data/user.entity';
import { Workspace } from '../../workspace/data/workspace.entity';

@Injectable()
@Processor(QueueNames.AUDIENCES)
export class AudienceScrapperService {
  private readonly logger = new Logger(AudienceScrapperService.name);

  @Inject(ThirdPartyAudienceApiService)
  private readonly thirdPartyAudienceApiService: ThirdPartyAudienceApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(AudienceRepository)
  private readonly audienceRepository: AudienceRepository;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(FileNestCrudService)
  private readonly fileService: FileNestCrudService;

  @Inject(PrettyLinkService)
  private readonly prettyLinkService: PrettyLinkService;

  @Process(QueueProcessNames.FETCH_AUDIENCES)
  async fetchAudiences(job: Job<any>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const { provider } = adAccount as AdAccount;
      const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
      const audiences = (
        await this.thirdPartyAudienceApiService.findAll({
          provider,
          accessToken,
          adAccountProviderId: adAccount.providerId,
        })
      )?.map(
        (audience: AudienceDto) =>
          ({
            ...audience,
            rules: audience.rules || {},
            adAccount: adAccount.id,
          } as Audience),
      );
      if (isEmpty(audiences)) {
        return `0 audiences successfully fetched`;
      }

      await this.syncAudiences(provider, adAccount, audiences);
      const created = await TypeOrmUpsert(this.audienceRepository, audiences, 'providerId', {
        doNotUpsert: ['provider', 'providerId', 'adAccount', 'lookalikeAudiences'],
      });
      await this.updateLookalikeAudiencesRef(audiences, created);
      return `${created.length} Audiences successfully fetched`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async syncAudiences(provider: SupportedProviders, adAccount: AdAccount, audiences: Audience[]): Promise<void> {
    const providerIds = audiences.map(({ providerId }) => providerId).filter((providerId) => !isUndefined(providerId));
    await this.audienceRepository.delete({ adAccount, provider, providerId: Not(In(providerIds)) });
  }

  async updateLookalikeAudiencesRef(foundAudiences: Audience[], upsertedAudiences: Audience[]) {
    const foundAudienceLookalikeAudiences = (audience: Audience) =>
      foundAudiences.find(
        ({ providerId, lookalikeAudiences }) => providerId === audience.providerId && lookalikeAudiences?.length,
      ).lookalikeAudiences;

    try {
      const audiencesWithLookalikeAudiences = upsertedAudiences
        .filter((audience) => foundAudienceLookalikeAudiences(audience)?.length)
        .map((audience) => ({
          ...audience,
          lookalikeAudiences: foundAudienceLookalikeAudiences(audience),
        }));
      return await this.audienceRepository.save(audiencesWithLookalikeAudiences);
    } catch (error) {
      return null;
    }
  }

  @Process(QueueProcessNames.ADD_MEMBERS)
  async addMembers(job: Job<any>): Promise<any> {
    return this.onTaskStarted(job, 'update');
  }

  @OnQueueCompleted({ name: QueueProcessNames.ADD_MEMBERS })
  async onAddMembersCompleted(job: Job<any>): Promise<void> {
    await this.onTaskFinished(job, 'completed');
  }

  @OnQueueFailed({ name: QueueProcessNames.ADD_MEMBERS })
  async onAddMembersFailed(job: Job<any>): Promise<void> {
    await this.onTaskFinished(job, 'failed');
  }

  @OnQueueRemoved({ name: QueueProcessNames.ADD_MEMBERS })
  async onAddMembersRemoved(job: Job<any>): Promise<void> {
    await this.onTaskRemoved(job);
  }

  @Process(QueueProcessNames.REMOVE_MEMBERS)
  async removeMembers(job: Job<any>): Promise<any> {
    return this.onTaskStarted(job, 'delete');
  }

  @OnQueueCompleted({ name: QueueProcessNames.REMOVE_MEMBERS })
  async onRemoveMembersCompleted(job: Job<any>): Promise<void> {
    await this.onTaskFinished(job, 'completed');
  }

  @OnQueueFailed({ name: QueueProcessNames.REMOVE_MEMBERS })
  async onRemoveMembersFailed(job: Job<any>): Promise<void> {
    await this.onTaskFinished(job, 'failed');
  }

  @OnQueueRemoved({ name: QueueProcessNames.REMOVE_MEMBERS })
  async onRemoveMembersRemoved(job: Job<any>): Promise<void> {
    await this.onTaskRemoved(job);
  }

  async onTaskStarted(job: Job<any>, method: 'update' | 'delete'): Promise<number> {
    const { data } = job;
    const {
      accessToken,
      audience,
    }: {
      accessToken: string;
      audience: Audience;
    } = data;
    const { providerId: audienceProviderId, provider } = audience;
    const action = this.getProviderAction(provider, method);
    const rawList = await this.buildList(data);
    const args = {
      accessToken,
      audienceProviderId,
      provider,
      rawList,
      action,
      method,
    };
    const { receivedCount, invalidCount, invalidList } =
      rawList.length > MAX_AUDIENCE_LIST_SIZE
        ? await this.batchConvertAndUploadList(args)
        : await this.convertAndUploadList(args);

    job.data.invalidList = invalidList;
    job.data.invalidCount = invalidCount;
    job.data.receivedCount = receivedCount;

    if (!receivedCount) {
      throw new Error('No audience members were uploaded');
    }
    return receivedCount;
  }

  async onTaskFinished(job: Job, state: 'completed' | 'failed'): Promise<void> {
    const { attachments, text, user } = this.buildMailContent(job, state);
    const emailSent = await this.sendEmail({
      attachments,
      text,
      user,
    });
    this.logger.log(
      `${upperFirst(state)} job ${job.id} of type ${job.name}: ${
        state === 'completed' ? job.returnvalue : job.failedReason
      } - Email ${emailSent ? '' : 'not'} sent`,
    );
    return job.remove();
  }

  async onTaskRemoved(job: Job): Promise<void> {
    const { data } = job;
    const { file } = data;
    await this.fileService.delete(file.id);
  }

  getProviderAction(provider: SupportedProviders, method: 'update' | 'delete'): DmpListActions | null {
    if (provider === SupportedProviders.LINKEDIN) {
      return method === 'update' ? DmpListActions.ADD : DmpListActions.REMOVE;
    }
    return null;
  }

  async batchConvertAndUploadList(options: {
    accessToken: string;
    audienceProviderId: string;
    provider: SupportedProviders;
    rawList: any[];
    action: DmpListActions | null;
    method: 'update' | 'delete';
  }): Promise<AudienceListUpdateOutput> {
    const { accessToken, action, audienceProviderId, method, provider, rawList } = options;
    let invalidList = [];
    let receivedCount = 0;
    let chunks = [];

    if (provider === SupportedProviders.LINKEDIN) {
      chunks = chunk(rawList, MAX_AUDIENCE_LIST_SIZE);
    } else {
      const fields = [...rawList[0]];
      rawList.splice(0, 1);
      chunks = chunk(rawList, MAX_AUDIENCE_LIST_SIZE).map((chk) => [fields, ...chk]);
    }

    await chunks.reduce(async (previousPromise: Promise<AudienceListUpdateOutput>, nextChunk: any[]) => {
      const { receivedCount: count, invalidList: partialInvalidList } = await previousPromise;
      invalidList = [...invalidList, ...partialInvalidList];
      receivedCount += count;

      return this.convertAndUploadList({
        accessToken,
        audienceProviderId,
        provider,
        rawList: nextChunk,
        action,
        method,
      });
    }, Promise.resolve({ receivedCount: 0, invalidList: [] } as AudienceListUpdateOutput));

    return { receivedCount, invalidCount: invalidList.length, invalidList };
  }

  async convertAndUploadList(options: {
    accessToken: string;
    audienceProviderId: string;
    provider: SupportedProviders;
    rawList: any[];
    action: DmpListActions | null;
    method: 'update' | 'delete';
  }): Promise<AudienceListUpdateOutput> {
    const { accessToken, action, audienceProviderId, method, provider, rawList } = options;
    const { list, invalidList, type } = await this.thirdPartyAudienceApiService.convertMembersList({
      provider,
      list: rawList,
      action,
    });
    const args = {
      accessToken,
      audienceProviderId,
      list,
      provider,
      type,
      method,
    };

    try {
      const { receivedCount, invalidList: providerInvalidList } = await this.thirdPartyAudienceApiService.updateList(
        args,
      );
      return { receivedCount, invalidList: [...invalidList, ...providerInvalidList] };
    } catch (error) {
      return { receivedCount: 0, invalidList: [] };
    }
  }

  async buildList(data: { audience: Audience; file: File }): Promise<any[]> {
    const { audience, file: fileMeta } = data;
    const { provider } = audience;
    const file = await this.fileService.downloadStream(fileMeta.id);
    return this.parseCsv(file, provider);
  }

  parseCsv(file: Readable, provider: SupportedProviders): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(file, {
        header: provider === SupportedProviders.LINKEDIN,
        skipEmptyLines: false,
        // TODO: use step function to convert row by row and optimize perf ?
        complete(results) {
          resolve(results.data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  invalidItemListToCsv(invalidList: AudienceListInvalidItem[]): string {
    return unparse(invalidList, { delimiter: ',' });
  }

  buildMailContent(job: Job, state: 'failed' | 'completed') {
    const { data, name } = job;
    const {
      audience,
      invalidList,
      invalidCount,
      receivedCount,
      workspace,
    }: {
      audience: Audience;
      invalidCount: number;
      invalidList: AudienceListInvalidItem[];
      receivedCount: number;
      workspace: Workspace;
    } = data;

    const { adAccount, provider } = audience;
    const attachments = invalidList?.length
      ? [{ filename: 'invalid_items.csv', content: this.invalidItemListToCsv(invalidList) }]
      : [];
    const mainStatus = `${upperFirst(state)} ${snakeCase(name).replace('_', ' ')} task`;
    const text = `${mainStatus} (sent:${receivedCount}, invalids:${invalidCount}) for ${provider} ${audience.name} from ${adAccount.name} adAccount`;
    return { attachments, text, user: workspace.owner };
  }

  async sendEmail(options: { user: User; text: string; attachments?: any[] }): Promise<boolean> {
    const { attachments, text, user } = options;
    const username = !(isEmpty(user.firstName) && isEmpty(user.lastName))
      ? `${user.firstName} ${user.lastName}`
      : 'Rockstar';
    const mailerOptions = await this.buildMailerOptions({ attachments, name: username, text, userEmail: user.email });
    try {
      const { accepted } = await this.mailerService.sendMail(mailerOptions);
      return accepted.length > 0;
    } catch (error) {
      return false;
    }
  }

  async buildMailerOptions(options: {
    userEmail: string;
    name: string;
    text: string;
    attachments?: any[];
  }): Promise<ISendMailOptions> {
    const { attachments, name, text, userEmail } = options;
    return {
      to: userEmail,
      subject: 'Audience members list update - Instigo',
      template: 'audience-members-list-update',
      context: {
        action_url: await this.prettyLinkService.audienceMemberListUpdatingShortUrl(''),
        name,
        text,
      },
      attachments: [...attachments],
    } as any;
  }
}
