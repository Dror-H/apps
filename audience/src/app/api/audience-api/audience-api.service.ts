import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudienceDto, SearchResult, SegmentAutoComplete } from '@instigo-app/data-transfer-object';
import { AudienceApiServiceAudiences, CrudService, GetAudiencesParams } from '@instigo-app/ui/shared';
import { Observable } from 'rxjs';

@Injectable()
export class AudienceApiService extends CrudService<AudienceDto, string> implements AudienceApiServiceAudiences {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', '');
  }

  public getAudiences(params: GetAudiencesParams): Observable<SearchResult[]> {
    return this.httpClient.get<SearchResult[]>('/server/search', { params });
  }

  public fetchAIKeywordsSuggestions(audiencesIds: string[], selectedKeywords: string[]): Observable<string[]> {
    return this.httpClient.get<string[]>('server/search/keywords-suggestions', {
      params: { keywords: selectedKeywords, id: audiencesIds },
    });
  }

  public fetchAutoCompleteSuggestions(keywords: string[]): Observable<SegmentAutoComplete[]> {
    return this.httpClient.get<SegmentAutoComplete[]>('server/search/segment_auto_complete', {
      params: { keywords, limit: 25 },
    });
  }
}
