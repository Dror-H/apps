import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdTemplateApiServiceMock {
  preview({ adAccount, adTemplateData, adTemplateType }) {
    return of({ body: '<iframe src=""></iframe>' });
  }

  uploadVideo({ adAccount, video }) {
    return of('upload video');
  }

  deleteMany(options: { adTemplateIds: string[] }): Observable<any> {
    return of('delete many');
  }
}
