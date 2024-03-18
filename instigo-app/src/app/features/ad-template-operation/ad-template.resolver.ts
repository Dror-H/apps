import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdTemplateResolver implements Resolve<any> {
  constructor(private adTemplateApiService: AdTemplateApiService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const {
      params: { id },
    } = route;
    return this.adTemplateApiService.findOne({ id });
  }
}
