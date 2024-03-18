import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdAccountDTO,
  AdSetDTO,
  BrowseOutput,
  CampaignDTO,
  FacebookTargetingOptionStatus,
  InstigoTargetingTypes,
  ReachOutputDto,
  SearchOutputDto,
  SupportedProviders,
  TargetingConditionDto,
  TargetingDto,
  TargetingTemplateState,
  UserTargetings,
} from '@instigo-app/data-transfer-object';
import { CrudService, removeFalsyFieldsFromObj, TargetingApiServiceAudiences } from '@instigo-app/ui/shared';
import { Observable } from 'rxjs';

@Injectable()
export class TargetingApiService extends CrudService<any, string> implements TargetingApiServiceAudiences {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', '');
  }

  public reach(options: {
    adAccountId: string;
    provider: SupportedProviders;
    targeting: TargetingTemplateState;
  }): Observable<ReachOutputDto> {
    const { adAccountId, targeting } = options;
    delete targeting.provider;
    return this.httpClient.post<ReachOutputDto>(`server/targeting/reach/${adAccountId}`, {
      targeting,
    });
  }

  public browse(options: { adAccountId: string }): Observable<BrowseOutput> {
    return this.httpClient.get<BrowseOutput>(`server/targeting/browse/${options.adAccountId}`);
  }

  public search(params: SearchParams): Observable<SearchOutputDto[]> {
    this.handleSearchParams(params);
    return this.httpClient.get<SearchOutputDto[]>('server/targeting/search', { params });
  }

  public suggestions(options: {
    adAccountProviderId: string;
    provider: SupportedProviders;
    targeting?: TargetingConditionDto[];
  }): Observable<SearchOutputDto[]> {
    const { adAccountProviderId, targeting } = options;
    return this.httpClient.put<SearchOutputDto[]>(`server/targeting/suggestions/${adAccountProviderId}`, { targeting });
  }

  public saveUserTargeting(options: {
    name: string;
    targeting: TargetingDto;
    userTags: string[];
  }): Observable<UserTargetings> {
    return this.httpClient.post<UserTargetings>(`server/targeting/save`, options);
  }

  public saveAndExportTargeting(options: {
    name: string;
    targeting: TargetingDto;
    userTags: string[];
    adAccount: AdAccountDTO;
  }): Observable<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }> {
    return this.httpClient.post<{ campaign: CampaignDTO; adSet: Partial<AdSetDTO> }>(
      `server/targeting/save_and_export`,
      options,
    );
  }

  public saveUserTargetingAndExportToFacebook(options: {
    adAccountProviderId: string;
    name: string;
    targeting: TargetingDto;
    userTags: string[];
  }): Observable<UserTargetings> {
    return this.httpClient.post<UserTargetings>(`server/targeting/save_and_export`, options);
  }

  public targetingStatus(targetingTemplateState: TargetingTemplateState, adAccountProviderId: string): Observable<any> {
    return this.httpClient.post<FacebookTargetingOptionStatus[]>(
      `server/targeting/targeting-status/${adAccountProviderId}`,
      {
        targeting: targetingTemplateState,
      },
    );
  }

  private handleSearchParams(params: SearchParams): void {
    const adAccountProviderId = params.adAccountId;
    (params as any).adAccountProviderId = adAccountProviderId;
    delete params.adAccountId;
    removeFalsyFieldsFromObj(params);
  }
}

export interface SearchParams {
  searchQuery: string;
  adAccountId?: string;
  type?: InstigoTargetingTypes;
  provider: SupportedProviders;
  providerSubType?: any;

  [k: string]: any;
}
