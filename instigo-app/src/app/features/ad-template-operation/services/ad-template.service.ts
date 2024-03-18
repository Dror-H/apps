import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdTemplateApiService } from '@app/api/services/ad-template.api.service';
import { AdTemplateFormGeneratorService } from '@app/features/ad-template-operation/services/ad-template-form-generator.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { AdTemplateDTO, PageDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable()
export class AdTemplateService {
  public adTemplateForm: FormGroup;

  @SelectSnapshot(WorkspaceState.adAccountsFormList) private adNetworks: any;

  constructor(
    private apiService: AdTemplateApiService,
    private adTemplateFormService: AdTemplateFormGeneratorService,
    private displayNotification: DisplayNotification,
  ) {}

  public createAdTemplate(payload, adTemplateName: string): Observable<AdTemplateDTO[]> {
    return this.apiService.bulkCreate({ payload }).pipe(
      take(1),
      tap(() => {
        this.displayNotification.displayNotification(
          new Notification({
            title: `Your ${adTemplateName} ad template has been created.`,
            type: NotificationType.SUCCESS,
          }),
        );
      }),
    );
  }

  public updateAdTemplate(
    adTemplateId: string,
    payload: AdTemplateDTO,
    adTemplateName: string,
  ): Observable<AdTemplateDTO> {
    return this.apiService.update({ id: adTemplateId, payload }).pipe(
      take(1),
      tap(() => {
        this.displayNotification.displayNotification(
          new Notification({
            title: `Your ${adTemplateName} ad template has been updated.`,
            type: NotificationType.SUCCESS,
          }),
        );
      }),
    );
  }

  public createPreview(adTemplateData, adAccount, adTemplateType) {
    return this.apiService
      .preview({
        adTemplateData,
        adAccount,
        adTemplateType,
      })
      .pipe(take(1));
  }

  public getPagesOfAdAccount(adAccountId: string, provider: SupportedProviders): PageDTO[] {
    if (adAccountId) {
      return this.getExtraAccountsFromProviderById(adAccountId, provider);
    }
    return null;
  }

  private getExtraAccountsFromProviderById(id: string, provider: SupportedProviders): any {
    return this.adNetworks
      .find((network) => network.value === provider)
      .adAccounts.find((adAccount) => adAccount.id === id).pages;
  }
}
