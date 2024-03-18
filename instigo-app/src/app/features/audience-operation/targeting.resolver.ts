import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { Observable } from 'rxjs';

@Injectable()
export class TargetingResolver implements Resolve<any> {
  constructor(private targetingApiService: TargetingApiService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const {
      params: { id },
    } = route;
    return this.targetingApiService.findOne({ id });
  }
}
