import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class AdTemplateServiceMock {
  constructor() {}

  public createAdTemplate(payload, adTemplateName: string): Observable<string> {
    return of('createAdTemplate');
  }

  public createPreview(adTemplateData, adAccount, adTemplateType) {
    return of('createPreview');
  }
}
