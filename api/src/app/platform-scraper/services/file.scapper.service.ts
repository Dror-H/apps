import { AdAccount } from '@api/ad-account/data/ad-account.entity';
import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { File } from '@api/file-manager/data/file.entity';
import { FileRepository } from '@api/file-manager/data/file.repository';
import {
  FileDTO,
  QueueNames,
  QueueProcessNames,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyImageApiService } from '@instigo-app/third-party-connector';
import { TypeOrmUpsert } from '@nest-toolbox/typeorm-upsert';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { isEmpty, isUndefined } from 'lodash';
import { In } from 'typeorm';

@Injectable()
@Processor(QueueNames.FILES)
export class FilesScrapperService {
  private readonly logger = new Logger(FilesScrapperService.name);

  @Inject(ThirdPartyImageApiService)
  private readonly thirdPartyImageApiService: ThirdPartyImageApiService;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(FileRepository)
  private readonly fileRepository: FileRepository;

  @Process(QueueProcessNames.FETCH_IMAGES)
  async fetchImages(job: Job<{ adAccount: AdAccount }>) {
    try {
      const { data } = job;
      const { adAccount } = data;
      const { provider } = adAccount;
      const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
      const images = (
        await this.thirdPartyImageApiService.findAll({
          provider,
          accessToken,
          adAccountProviderId: adAccount.providerId,
        })
      ).map((image: FileDTO) => ({
        adAccountId: adAccount.id,
        workspace: { id: adAccount.workspace.id },
        ...image,
      }));
      if (isEmpty(images)) {
        return `0 images successfully fetched for ${adAccount.name}`;
      }
      await this.syncFiles(provider, adAccount, images);
      const created = (await TypeOrmUpsert<File[]>(this.fileRepository, images as any, 'providerId', {
        doNotUpsert: ['provider', 'providerId', 'adAccountId', 'workspace'],
      })) as File[];
      return `${created.length} images successfully fetched for ${adAccount.name}`;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async syncFiles(provider: SupportedProviders, adAccount: AdAccount, images: FileDTO[] = []): Promise<void> {
    const providerIds = images.map(({ providerId }) => providerId).filter((providerId) => !isUndefined(providerId));
    if (providerIds.length > 0) {
      const fetchedPostIds = (await this.fileRepository.find({ where: { adAccountId: adAccount.id } })).map(
        (file) => file.providerId,
      );
      const idsDiff: string[] = fetchedPostIds.filter((id: string) => !providerIds.includes(id));
      await this.fileRepository
        .createQueryBuilder(Resources.FILES)
        .delete()
        .where({ provider, providerId: In(idsDiff) })
        .execute();
    }
  }

  @OnQueueCompleted({ name: QueueProcessNames.FETCH_IMAGES })
  onCompleted(job: Job<any>) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`);
  }
}
