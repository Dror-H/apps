import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AudienceApiService } from '../../api/services/audience.api.service';

@Injectable()
export class AudienceResolver implements Resolve<any> {
  constructor(private audienceService: AudienceApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const {
      params: { id },
    } = route;
    return this.audienceService.findOne({ id });
  }
}
