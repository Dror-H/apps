import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeadgenFormApiService } from '@app/api/services/leadgen-form.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { LeadgenFormDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class FacebookSdkMethodsService {
  constructor(private leadgenFormApiService: LeadgenFormApiService, private displayNotification: DisplayNotification) {}

  public createLeadgenForm(options: { adAccountProviderId: string; selectedPageId: string }): Promise<any> {
    const { adAccountProviderId, selectedPageId } = options;
    const FB = (window as any).FB;
    return new Promise((resolve, reject) => {
      FB.ui(
        {
          account_id: adAccountProviderId.replace('act_', ''),
          display: 'popup',
          method: 'lead_gen',
          page_id: selectedPageId,
        },
        (response) => {
          if (!response) {
            return resolve(null);
          }
          if (response?.status === 'success') {
            this.displayNotification.displayNotification(
              new Notification({
                titleId: 'app.leadForm.successOnFacebook',
                type: NotificationType.SUCCESS,
              }),
            );
            const leadForm: LeadgenFormDTO = {
              providerId: response.formID,
              provider: SupportedProviders.FACEBOOK,
              name: this.replacePlussesFromFacebookResponse(response.name),
              leadsCount: 0,
              expiredLeadsCount: 0,
              page: {
                providerId: response.pageID,
              } as any,
            };
            this.leadgenFormApiService
              .create({ payload: leadForm })
              .pipe(
                tap((leadForm: LeadgenFormDTO) => {
                  this.displayNotification.displayNotification(
                    new Notification({
                      titleId: 'app.leadForm.successOnInstigo',
                      type: NotificationType.SUCCESS,
                    }),
                  );
                }),
                catchError((err: HttpErrorResponse) => {
                  this.displayNotification.displayNotification(
                    new Notification({ content: err.message, type: NotificationType.ERROR }),
                  );
                  return throwError(new Error(err.message));
                }),
              )
              .subscribe(
                (response) => resolve(response),
                (err) => reject(err),
              );
          } else {
            this.displayNotification.displayNotification(
              new Notification({
                titleId: 'app.leadForm.createErrorOnFacebook',
                type: NotificationType.ERROR,
              }),
            );
            reject(response);
          }
        },
      );
    });
  }

  private replacePlussesFromFacebookResponse(name: string): string {
    return name
      .split('+++')
      .join(' INSTIGOPLUS ')
      .split('++')
      .join(' INSTIGOPLUS ')
      .split('+')
      .join(' ')
      .split('INSTIGOPLUS')
      .join('+');
  }
}
