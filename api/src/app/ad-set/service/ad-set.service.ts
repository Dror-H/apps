import {
  AdSetCreationDTO,
  WorkspaceDTO,
  AdSetDTO,
  ResponseSuccess,
  SupportedProviders,
  TargetingDto,
  CacheTtlSeconds,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAdSetApiService } from '@instigo-app/third-party-connector';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { groupBy } from 'lodash';
import { from, Observable } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { AdSet } from '../data/ad-set.entity';
import { AdSetRepository } from '../data/ad-set.repository';

@Injectable()
export class AdSetService {
  @Inject(ThirdPartyAdSetApiService)
  private readonly thirdPartyAdSetApiService: ThirdPartyAdSetApiService;

  @Inject(AdSetRepository)
  private readonly repo: AdSetRepository;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  async create(adSet: Partial<AdSetCreationDTO>, currentWorkspace: WorkspaceDTO): Promise<AdSetDTO> {
    const { provider, adAccount, campaign } = adSet;
    const { accessToken } = currentWorkspace.owner.getAccessToken({ provider });
    const builtAdSet = await this.thirdPartyAdSetApiService.create({
      accessToken,
      adAccountProviderId: adAccount.providerId,
      provider,
      adSet: adSet,
    });
    builtAdSet.adAccount = adAccount;
    builtAdSet.campaign = campaign;
    return this.repo.save(builtAdSet);
  }

  bulkPatch(options: { adSets: Partial<AdSetDTO>[]; workspace: WorkspaceDTO }): Observable<any> {
    const { adSets, workspace } = options;
    void this.cacheManager.reset();
    return from(Object.entries(groupBy(adSets, 'provider'))).pipe(
      mergeMap(([provider, entries]) => {
        const { accessToken } = workspace.owner.getAccessToken({ provider });
        return this.thirdPartyAdSetApiService.bulkPatch({ provider, accessToken, adSets: entries });
      }),
      switchMap(() => this.repo.save(adSets)),
      map(() => new ResponseSuccess('AdSets successfully updated')),
    );
  }

  async findAdSetTargeting(options: {
    workspace: WorkspaceDTO;
    provider: SupportedProviders;
    adSetId: string;
  }): Promise<TargetingDto> {
    const { adSetId, provider, workspace } = options;
    const cacheKey = `adSetTargeting-${provider}-${adSetId}`;
    let result = await this.cacheManager.get(cacheKey);
    if (result) {
      return result as any;
    }
    const { accessToken } = workspace.owner.getAccessToken({ provider });
    result = await this.thirdPartyAdSetApiService.findAdSetTargeting({
      accessToken,
      adSetId,
      provider,
    });
    await this.cacheManager.set(cacheKey, result, { ttl: CacheTtlSeconds.ONE_HOUR });
    return result as any;
  }
}
