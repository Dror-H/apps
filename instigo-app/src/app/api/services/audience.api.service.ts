import { AudienceApiServiceInstigo, CrudService } from '@instigo-app/ui/shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudienceDto, AudienceTrackerDto, Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';

@Injectable()
export class AudienceApiService extends CrudService<AudienceDto, string> implements AudienceApiServiceInstigo {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.AUDIENCES);
  }

  deleteMany(options: { audienceIds: string[] }): Observable<any> {
    const { audienceIds } = options;
    return this.httpClient.delete(`server/${Resources.AUDIENCES}?audienceIds=${audienceIds}`);
  }

  findAllTrackers(options: {
    adAccountProviderId: string;
    provider: SupportedProviders;
  }): Observable<AudienceTrackerDto[]> {
    const { adAccountProviderId, provider } = options;
    return this.httpClient.get<AudienceTrackerDto[]>(
      `server/${Resources.AUDIENCES}/trackers?adAccountProviderId=${adAccountProviderId}&provider=${provider}`,
      { headers: { ignoreLoadingBar: '' } },
    );
  }

  createTracker(options: { adAccountProviderId: string; provider: SupportedProviders; name: string }): Observable<any> {
    const { adAccountProviderId, provider, name } = options;
    return this.httpClient.post(
      `server/${Resources.AUDIENCES}/trackers?adAccountProviderId=${adAccountProviderId}&provider=${provider}`,
      {
        name,
      },
    );
  }

  getTemplate(options: { provider: SupportedProviders; type?: 'users' | 'companies' }): Observable<any> {
    const { provider, type } = options;
    const query = type ? `provider=${provider}&type=${type}` : `provider=${provider}`;
    return this.httpClient.get(`server/${Resources.AUDIENCES}/template?${query}`, { responseType: 'text' });
  }

  uploadFiles(options: {
    audienceId: string;
    file: File;
    reportProgress?: boolean;
    method: 'add-list' | 'remove-list';
  }): Observable<any> {
    const { audienceId, file, method, reportProgress } = options;
    const url = `server/${Resources.AUDIENCES}/${audienceId}/${method}`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders({ enctype: 'multipart/form-data', 'business-entity': Resources.AUDIENCES });
    return this.httpClient.post(url, formData, { headers, reportProgress });
  }
}
