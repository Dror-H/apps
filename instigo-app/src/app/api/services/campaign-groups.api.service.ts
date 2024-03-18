import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { CampaignGroupDTO, Resources } from '@instigo-app/data-transfer-object';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CampaignGroupsApiService extends CrudService<CampaignGroupDTO, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.CAMPAIGN_GROUP);
  }
}
