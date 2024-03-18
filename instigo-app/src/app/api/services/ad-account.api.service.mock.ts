import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DateRange } from '@instigo-app/data-transfer-object';

@Injectable()
export class AdAccountApiServiceMock {
  public getAvailableAdAccounts({ provider }): Observable<any[]> {
    return of(['something']);
  }

  public getInsights(options: { id: string; datePreset: string; dateRange: DateRange }): Observable<any[]> {
    return of(['some insights']);
  }

  public addTimeQueryParamsToUrl(url: string, datePreset: string, dateRange: DateRange): string {
    return 'new url';
  }
}
