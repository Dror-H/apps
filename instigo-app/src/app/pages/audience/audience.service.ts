import { Injectable } from '@angular/core';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { AudienceApiService } from '@app/api/services/audience.api.service';
import { catchError, tap } from 'rxjs/operators';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { AudienceDto } from '@instigo-app/data-transfer-object';

@Injectable()
export class AudienceService {
  constructor(
    private targetingService: TargetingApiService,
    private audienceApiService: AudienceApiService,
    private displayNotification: DisplayNotification,
  ) {}

  public callApiForLookalikeOrCustom(payload, providers: string): Observable<AudienceDto[]> {
    return this.audienceApiService.bulkCreate({ payload }).pipe(
      tap((audiences) => {
        this.handleResponse(audiences, payload, providers);
      }),
      catchError((err: HttpErrorResponse) => {
        this.displayNotification.displayNotification(
          new Notification({
            content: err.error.message || err.error.error.details.message,
            type: NotificationType.ERROR,
          }),
        );
        return throwError(err.error.message || err.error.error.details.message);
      }),
    );
  }

  public callApiUpdateAudience(payload): Observable<AudienceDto[]> {
    return this.audienceApiService.bulkUpdate({ payload }).pipe(
      tap(() => {
        this.displayNotification.displayNotification(
          new Notification({
            title: 'Audience Updated',
            content: `${payload[0].name || 'Your audience'} have been successfully updated`,
            type: NotificationType.SUCCESS,
          }),
        );
      }),
      catchError((err: HttpErrorResponse) => {
        this.displayNotification.displayNotification(
          new Notification({ content: err.error.message, type: NotificationType.ERROR }),
        );
        return throwError(err.error.message);
      }),
    );
  }

  public callApiSavedAudience(payload, providers: string): Observable<AudienceDto[]> {
    return this.targetingService.bulkCreate({ payload }).pipe(
      tap(() => {
        console.log(payload);
        this.displayNotification.displayNotification(
          new Notification({
            title: `${providers} Saved Audience Created`,
            content: `${payload[0].name || 'Your audience'} was successfully created`,
            type: NotificationType.SUCCESS,
          }),
        );
      }),
      catchError((err: HttpErrorResponse) => {
        this.displayNotification.displayNotification(
          new Notification({ content: err.error.message, type: NotificationType.ERROR }),
        );
        return throwError(new Error(err.error.message));
      }),
    );
  }

  private handleResponse(audiences: AudienceDto[], payload: any, providers: string) {
    this.handle300StatusCode(audiences);
    this.handle200StatusCode(payload, providers);
    this.handle100StatusCode(audiences);
  }

  private handle300StatusCode(audiences: AudienceDto[]): void {
    if (audiences[0]?.metadata?.delivery_status?.code >= 300 && audiences[0]?.metadata?.delivery_status?.code < 400) {
      this.displayNotification.displayNotification(
        new Notification({
          title: `Warning`,
          content: audiences[0]?.metadata?.delivery_status?.description,
          type: NotificationType.WARNING,
        }),
      );
    }
  }

  private handle200StatusCode(payload: any, providers: string): void {
    this.displayNotification.displayNotification(
      new Notification({
        title: `${providers} Audience Created`,
        content: `${payload[0].name || 'Your audience'} was successfully created`,
        type: NotificationType.SUCCESS,
      }),
    );
  }

  private handle100StatusCode(audiences: AudienceDto[]): void {
    if (audiences[0]?.metadata?.delivery_status?.code >= 100 && audiences[0]?.metadata?.delivery_status?.code < 200) {
      this.displayNotification.displayNotification(
        new Notification({
          title: `Info`,
          content: audiences[0]?.metadata?.delivery_status?.description,
          type: NotificationType.INFO,
        }),
      );
    }
  }
}
