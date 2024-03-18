import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureToggleGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const featureName = route.data.feature;
    return environment.features[featureName];
  }
}
