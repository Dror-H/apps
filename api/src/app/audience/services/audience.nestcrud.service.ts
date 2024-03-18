import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { File } from '@api/file-manager/data/file.entity';
import { WorkspaceNestCrudService } from '@api/workspace/services/workspace.nestcrud.service';
import {
  AudienceDto,
  AudienceTrackerDto,
  CacheTtlSeconds,
  CSVTemplateTypes,
  QueueNames,
  QueueProcessNames,
  ResponseSuccess,
  SupportedProviders,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAudienceApiService } from '@instigo-app/third-party-connector';
import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import to from 'await-to-js';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { groupBy } from 'lodash';
import { from } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Audience } from '../data/audience.entity';
import { AudienceRepository } from '../data/audience.repository';

@Injectable()
export class AudienceNestCrudService extends TypeOrmCrudService<Audience> {
  logger = new Logger(AudienceNestCrudService.name);

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(ThirdPartyAudienceApiService)
  private readonly thirdPartyAudienceApiService: ThirdPartyAudienceApiService;

  @Inject(WorkspaceNestCrudService)
  private readonly workspaceService: WorkspaceNestCrudService;

  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

  constructor(
    @Inject(AudienceRepository) repo: AudienceRepository,
    @InjectQueue(QueueNames.AUDIENCES) private readonly thirdPartyAudiences: Queue,
  ) {
    super(repo);
  }

  async create(audience: Partial<AudienceDto>): Promise<AudienceDto> {
    const { provider, adAccount } = audience;
    const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    const builtAudience = await this.thirdPartyAudienceApiService.create({
      accessToken,
      adAccountProviderId: adAccount.providerId,
      provider,
      audience,
    });
    builtAudience.adAccount = adAccount;
    return this.repo.save(builtAudience as Audience);
  }

  async deleteById(audienceId: string): Promise<string> {
    const audience = await this.repo.findOneOrFail(audienceId, { relations: ['adAccount'] });
    const { provider, adAccount } = audience;
    const { accessToken } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    const [err, result] = await to(
      this.thirdPartyAudienceApiService.delete({
        accessToken,
        adAccountProviderId: adAccount.providerId,
        provider,
        audience,
      }),
    );
    if (err) {
      throw err;
    }
    await this.repo.delete(audienceId);
    return audienceId;
  }

  async createTracker(options: {
    workspaceId: string;
    provider: SupportedProviders;
    adAccountProviderId: string;
    name: string;
  }): Promise<AudienceTrackerDto> {
    const { adAccountProviderId, name, provider, workspaceId } = options;
    const accessToken = await this.workspaceService.findWorkspaceOwnerOauthToken(workspaceId, provider);
    return this.thirdPartyAudienceApiService.createTracker({
      provider,
      accessToken,
      adAccountProviderId,
      name,
    });
  }

  async findTrackers(options: {
    workspaceId: string;
    provider: SupportedProviders;
    adAccountProviderId: string;
  }): Promise<AudienceTrackerDto[]> {
    const { adAccountProviderId, provider, workspaceId } = options;
    const cacheKey = `findTrackers-${provider}-${adAccountProviderId}`;
    const result = await this.cacheManager.get(cacheKey);
    if (result) {
      return result as any;
    }
    const accessToken = await this.workspaceService.findWorkspaceOwnerOauthToken(workspaceId, provider);
    const [err, trackers] = await to(
      this.thirdPartyAudienceApiService.findAllTrackers({
        accessToken,
        adAccountProviderId,
        provider,
      }),
    );
    if (err) {
      return [];
    }
    await this.cacheManager.set(cacheKey, trackers, { ttl: CacheTtlSeconds.ONE_HOUR });
    return result as any;
  }

  async getTemplate(options: { provider: SupportedProviders; type?: CSVTemplateTypes }): Promise<string> {
    const { provider, type } = options;
    const cacheKey = `audienceCsvTemplate-${provider}${type || ''}`;
    let result = await this.cacheManager.get(cacheKey);
    if (result) {
      return result as any;
    }
    result = await this.thirdPartyAudienceApiService.getTemplate({
      provider,
      type,
    });
    await this.cacheManager.set(cacheKey, result, { ttl: CacheTtlSeconds.ONE_MINUTE });
    return result as any;
  }

  async addList(options: { audienceId: string; file: File }): Promise<boolean> {
    const { audienceId, file } = options;
    const audience = await this.repo.findOneOrFail(audienceId, { relations: ['adAccount'] });
    const { adAccount } = audience;
    const { accessToken, workspace } = await this.adAccountRepository.findWithAccessToken({
      id: audience.adAccount.id,
    });
    const job = await this.thirdPartyAudiences.add(QueueProcessNames.ADD_MEMBERS, {
      accessToken,
      adAccountProviderId: adAccount.providerId,
      audience,
      file,
      workspace,
    });
    return job && job.hasOwnProperty('id');
  }

  async removeList(options: { audienceId: string; file: File }): Promise<boolean> {
    const { audienceId, file } = options;
    const audience = await this.repo.findOneOrFail(audienceId, { relations: ['adAccount'] });
    const { adAccount } = audience;
    const { accessToken, workspace } = await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    const job = await this.thirdPartyAudiences.add(QueueProcessNames.REMOVE_MEMBERS, {
      accessToken,
      adAccountProviderId: adAccount.providerId,
      audience,
      file,
      workspace,
    });
    return job && job.hasOwnProperty('id');
  }

  async bulkPatch(options: { audiences: Partial<AudienceDto>[]; workspace: WorkspaceDTO }): Promise<any> {
    const { audiences, workspace } = options;
    await this.cacheManager.reset();
    return await from(Object.entries(groupBy(audiences, 'provider')))
      .pipe(
        mergeMap(([provider, entries]) => {
          const { accessToken } = workspace.owner.getAccessToken({ provider });
          return this.thirdPartyAudienceApiService.bulkPatch({
            provider: provider as SupportedProviders,
            accessToken,
            audiences: entries,
          });
        }),
        switchMap(() => this.repo.save(audiences)),
        map(() => new ResponseSuccess('Campaigns successfully updated')),
      )
      .toPromise();
  }
}
