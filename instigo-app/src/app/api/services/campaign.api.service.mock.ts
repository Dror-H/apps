import { Injectable } from '@angular/core';
import { CreateQueryParams } from '@nestjsx/crud-request';
import { Observable, of } from 'rxjs';

@Injectable()
export class CampaignApiServiceMock {
  constructor() {}

  getCampaignInsightsByAdAccount(options: {
    adAccountId: string;
    datePreset: string;
    extraQueryParams: CreateQueryParams;
  }): Observable<any> {
    return of('some return value');
  }

  excelExport(options: { query: string }): Observable<any> {
    return of(['sadsk;jfa']);
  }
}
