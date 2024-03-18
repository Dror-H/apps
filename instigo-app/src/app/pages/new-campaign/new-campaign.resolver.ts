import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NewCampaignResolver implements Resolve<string> {
  constructor(private draftService: CampaignDraftApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return this.draftService
      .findOne({ id: route.paramMap.get('id') })
      .pipe(catchError(() => this.router.navigate(['campaign-draft'], { queryParams: { hasNoDraft: true } })));
  }
}
