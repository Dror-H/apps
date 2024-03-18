import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  InstigoTargetingTypes,
  Resources,
  SearchOutputDto,
  SupportedProviders,
  TargetingConditionDto,
  ReachOutputDto,
  TargetingTemplateState,
  BrowseOutput,
} from '@instigo-app/data-transfer-object';
import { CrudService, TargetingApiServiceInstigo } from '@instigo-app/ui/shared';
import { Observable } from 'rxjs';

@Injectable()
export class TargetingApiService extends CrudService<any, string> implements TargetingApiServiceInstigo {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.TARGETING_TEMPLATES);
  }

  deleteMany(options: { targetingIds: string[] }): Observable<any> {
    const { targetingIds } = options;
    return this.httpClient.delete(`server/${Resources.TARGETING_TEMPLATES}?targetingIds=${targetingIds}`);
  }

  search(options: {
    searchQuery: string;
    adAccountId?: string;
    type?: InstigoTargetingTypes;
    provider: SupportedProviders;
    providerSubType?: any;
  }): Observable<SearchOutputDto[]> {
    const { searchQuery, type, provider, providerSubType, adAccountId } = options;
    let searchUrl = `server/${Resources.TARGETING_TEMPLATES}/search?searchQuery=${searchQuery}&provider=${provider}`;
    if (type) {
      searchUrl = `${searchUrl}&type=${type}`;
    }
    if (providerSubType) {
      searchUrl = `${searchUrl}&providerSubType=${providerSubType}`;
    }
    if (adAccountId) {
      searchUrl = `${searchUrl}&adAccountProviderId=${adAccountId}`;
    }
    return this.httpClient.get<SearchOutputDto[]>(searchUrl);
  }

  browse(options: { adAccountId: string; provider: SupportedProviders }): Observable<BrowseOutput> {
    const { adAccountId, provider } = options;
    return this.httpClient.get<BrowseOutput>(
      `server/${Resources.TARGETING_TEMPLATES}/browse?adAccountProviderId=${adAccountId}&provider=${provider}`,
    );
  }

  suggestions(options: {
    adAccountProviderId: string;
    provider: SupportedProviders;
    targeting?: TargetingConditionDto[];
  }): Observable<SearchOutputDto[]> {
    const { adAccountProviderId, provider, targeting } = options;
    return this.httpClient.put<SearchOutputDto[]>(
      `server/${Resources.TARGETING_TEMPLATES}/suggestions?adAccountProviderId=${adAccountProviderId}&provider=${provider}`,
      { targeting },
    );
  }

  reach(options: {
    adAccountId: string;
    provider: SupportedProviders;
    targeting: TargetingTemplateState;
  }): Observable<ReachOutputDto> {
    const { adAccountId, provider, targeting } = options;
    delete targeting.provider;
    return this.httpClient.post<ReachOutputDto>(
      `server/${Resources.TARGETING_TEMPLATES}/reach?adAccountProviderId=${adAccountId}&provider=${provider}`,
      {
        targeting,
      },
    );
  }
}
