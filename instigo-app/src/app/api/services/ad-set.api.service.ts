import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdSetDTO,
  CampaignStatusType,
  Resources,
  SupportedProviders,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CrudService } from '../crud.service';

@Injectable()
export class AdSetApiService extends CrudService<AdSetDTO, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.AD_SETS);
  }

  changeStatus(options: { adsets: Partial<AdSetDTO>[]; status: CampaignStatusType }) {
    const { adsets, status } = options;
    const mapped = adsets.map<Partial<AdSetDTO>>((adSet) => ({
      id: adSet.id,
      providerId: adSet.providerId,
      provider: adSet.provider,
      status,
    }));
    return this.bulkUpdate({ payload: mapped }).pipe(take(1));
  }

  findAdSetTargeting(options: { adSetId: string; provider: SupportedProviders }): Observable<TargetingDto> {
    const { adSetId, provider } = options;
    return this.httpClient
      .get<TargetingDto>(`server/${Resources.AD_SETS}/targeting?adSetId=${adSetId}&provider=${provider}`)
      .pipe(take(1));
  }
}
