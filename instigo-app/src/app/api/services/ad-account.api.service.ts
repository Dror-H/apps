import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdAccountDTO, AvailableAdAccountsDTO, Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CrudService } from '../crud.service';

@Injectable()
export class AdAccountApiService extends CrudService<AdAccountDTO, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.AD_ACCOUNTS);
  }

  public getAvailableAdAccounts(options: { provider: SupportedProviders }): Observable<AvailableAdAccountsDTO[]> {
    return this.httpClient
      .get<AvailableAdAccountsDTO[]>(`server/${Resources.AD_ACCOUNTS}/available/${options.provider}`)
      .pipe(take(1));
  }

  public checkAdAccountTos(options: {
    providerId: string;
  }): Observable<{ tos_accepted: { custom_audience_tos: number } }> {
    return this.httpClient
      .get<{ tos_accepted: { custom_audience_tos: number } }>(
        `server/${Resources.AD_ACCOUNTS}/check-tos/${options.providerId}`,
      )
      .pipe(take(1));
  }

  public checkPageTos(options: { pageProviderId: string }): Observable<{ leadgen_tos_accepted: boolean }> {
    return this.httpClient
      .get<{ leadgen_tos_accepted: boolean }>(
        `server/${Resources.AD_ACCOUNTS}/check-tos-page/${options.pageProviderId}`,
      )
      .pipe(take(1));
  }
}
