import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AudiencesService } from '@audience-app/global/services/audiences/audiences.service';
import { DisplayNotificationService } from '@audience-app/global/services/display-notification/display-notification.service';
import { notificationOnErrorOperator } from '@audience-app/global/utils/operators';
import { getArrayFromParams } from '@audience-app/global/utils/param-utils';
import { AudiencesState } from '@audience-app/store/audiences.state';
import { SearchResult } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { EMPTY, MonoTypeOperatorFunction, Observable, pipe, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MergedAudienceResolver implements Resolve<SearchResult[]> {
  @SelectSnapshot(AudiencesState.getSelectedAudiences) selectedAudiences: SearchResult[];

  constructor(
    private audiencesService: AudiencesService,
    private displayNotificationService: DisplayNotificationService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SearchResult[]> {
    if (!this.selectedAudiences.length) {
      return throwError(new Error('At least one audience must be selected')).pipe(
        this.onErrorOperators(),
        finalize(() => void this.router.navigateByUrl('/')),
      );
    }

    return this.audiencesService.getAudiencesById(this.getIds(route)).pipe(this.onErrorOperators());
  }

  private getIds(route: ActivatedRouteSnapshot): string[] {
    const paramsId = route.queryParams.id;
    if (!paramsId) {
      return this.selectedAudiences.map(({ id }) => id);
    }
    return getArrayFromParams(paramsId);
  }

  private onErrorOperators<T>(): MonoTypeOperatorFunction<T> {
    return pipe(
      notificationOnErrorOperator(this.displayNotificationService),
      catchError(() => EMPTY),
    );
  }
}
