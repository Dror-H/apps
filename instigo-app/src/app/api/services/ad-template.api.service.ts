import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { AdAccountDTO, AdTemplateDTO, Resources } from '@instigo-app/data-transfer-object';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { VideoDto } from '@instigo-app/data-transfer-object';

@Injectable()
export class AdTemplateApiService extends CrudService<AdTemplateDTO, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.AD_TEMPLATES);
  }

  preview({ adAccount, adTemplateData, adTemplateType }) {
    return this.httpClient
      .post(`server/${Resources.AD_TEMPLATES}/preview`, { adAccount, adTemplateData, adTemplateType })
      .pipe(take(1));
  }

  uploadVideo({ adAccount, video }: { adAccount: AdAccountDTO; video: VideoDto }): Observable<any> {
    return this.httpClient.post(`server/${Resources.AD_TEMPLATES}/upload-video`, { adAccount, video }).pipe(take(1));
  }

  deleteMany(options: { adTemplateIds: string[] }): Observable<any> {
    const { adTemplateIds } = options;
    return this.httpClient.delete(`server/${Resources.AD_TEMPLATES}?adTemplateIds=${adTemplateIds}`).pipe(take(1));
  }
}
