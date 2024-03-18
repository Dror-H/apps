import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdDTO, AdUpdateDTO, CampaignStatusType, Resources } from '@instigo-app/data-transfer-object';
import { CrudService } from '../crud.service';

@Injectable()
export class AdApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.ADS);
  }

  public changeStatus(options: { ads: Partial<AdDTO>[]; status: CampaignStatusType }) {
    const { ads, status } = options;
    const mapped = ads.map<Partial<AdDTO>>((ad) => ({
      id: ad.id,
      providerId: ad.providerId,
      provider: ad.provider,
      status,
    }));
    return this.bulkUpdate({ payload: mapped });
  }

  public updateAd(ad: AdUpdateDTO) {
    return this.httpClient.post(`server/${Resources.ADS}/updateAd`, { payload: ad });
  }
}
