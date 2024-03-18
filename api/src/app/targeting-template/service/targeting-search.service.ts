import { WorkspaceNestCrudService } from '@api/workspace/services/workspace.nestcrud.service';
import {
  BrowseOutput,
  CacheTtlSeconds,
  InstigoTargetingTypes,
  ReachOutputDto,
  SearchOutputDto,
  SupportedProviders,
  TargetingDto,
  TargetingSubTypes,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyTargetingApiService } from '@instigo-app/third-party-connector';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class TargetingSearchService {
  @Inject(ThirdPartyTargetingApiService)
  private readonly thirdPartyTargetingApiService: ThirdPartyTargetingApiService;

  @Inject(WorkspaceNestCrudService)
  private readonly workspaceService: WorkspaceNestCrudService;

  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

  async search(options: {
    workspaceId: string;
    provider: SupportedProviders;
    searchQuery: string;
    type: InstigoTargetingTypes;
    providerSubType?: TargetingSubTypes;
    adAccountProviderId?: string;
  }): Promise<SearchOutputDto[]> {
    const { adAccountProviderId, provider, providerSubType, workspaceId, searchQuery, type } = options;
    const accessToken = await this.workspaceService.findWorkspaceOwnerOauthToken(workspaceId, provider);
    return this.thirdPartyTargetingApiService.search({
      accessToken,
      adAccountProviderId,
      provider,
      searchQuery,
      providerSubType,
      type,
    });
  }

  suggestions({ accessToken, provider, selected, adAccountProviderId }) {
    return this.thirdPartyTargetingApiService.suggestions({ accessToken, provider, selected, adAccountProviderId });
  }

  async browse(options: {
    workspaceId: string;
    provider: SupportedProviders;
    limitTypes?: InstigoTargetingTypes[];
    adAccountProviderId?: string;
  }): Promise<BrowseOutput> {
    const { adAccountProviderId, limitTypes, provider, workspaceId } = options;
    const cacheKey = limitTypes ? `browse-${provider}-${limitTypes.join(',')}` : `browse-${provider}`;
    let result = await this.cacheManager.get(cacheKey);
    if (result) {
      return result;
    }
    const accessToken = await this.workspaceService.findWorkspaceOwnerOauthToken(workspaceId, provider);
    result = await this.thirdPartyTargetingApiService.browse({
      accessToken,
      adAccountProviderId,
      limitTypes,
      provider,
    });
    await this.cacheManager.set(cacheKey, result, { ttl: CacheTtlSeconds.ONE_HOUR });
    return result;
  }

  async reach(options: {
    workspaceId: string;
    provider: SupportedProviders;
    targeting: TargetingDto;
    adAccountProviderId?: string;
  }): Promise<ReachOutputDto> {
    const { adAccountProviderId, provider, targeting, workspaceId } = options;
    const accessToken = await this.workspaceService.findWorkspaceOwnerOauthToken(workspaceId, provider);
    return this.thirdPartyTargetingApiService.reach({ accessToken, adAccountProviderId, provider, targeting });
  }
}
