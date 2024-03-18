import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TargetingDisplay } from '@app/global/constants';
import {
  LinkedinBidSuggestionsDto,
  LinkedinCampaignDraft,
  Resources,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CrudService } from '../crud.service';

@Injectable()
export class CampaignApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.CAMPAIGNS);
  }

  public findCampaignTargeting(options: {
    campaignId: string;
    provider: SupportedProviders;
  }): Observable<TargetingDisplay[]> {
    const { campaignId, provider } = options;
    return this.httpClient
      .get<TargetingDisplay[]>(`server/${Resources.CAMPAIGNS}/targeting?campaignId=${campaignId}&provider=${provider}`)
      .pipe(take(1));
  }

  public deleteMany(options: { campaignIds: string[] }): Observable<any> {
    const { campaignIds } = options;
    return this.httpClient.delete<string[]>(`server/${Resources.CAMPAIGNS}?campaignIds=${campaignIds}`).pipe(take(1));
  }

  public getLinkedinBidSuggestions(campaign: LinkedinCampaignDraft): Observable<LinkedinBidSuggestionsDto> {
    return this.httpClient
      .post<LinkedinBidSuggestionsDto>(`server/${Resources.CAMPAIGNS}/bid-suggestions`, campaign)
      .pipe(take(1));
  }
}
