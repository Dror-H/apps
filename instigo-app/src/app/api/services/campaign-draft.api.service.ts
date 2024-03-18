import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { CampaignDraftDTO, Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable()
export class CampaignDraftApiService extends CrudService<CampaignDraftDTO, string> {
  private static DRAFT_SAVE_INTERVAL = 1000;

  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.CAMPAIGN_DRAFTS);
  }

  public deleteMany(options: { campaignDraftIds: string[] }): Observable<string[]> {
    const { campaignDraftIds } = options;
    return this.httpClient
      .delete<string[]>(`server/${Resources.CAMPAIGN_DRAFTS}?campaignDraftIds=${campaignDraftIds}`)
      .pipe(take(1));
  }

  public listenOnCampaignChangesAndSaveDraft(
    campaignForm: FormGroup,
    campaignDraftId: BehaviorSubject<{ draftId: string; provider: SupportedProviders }>,
  ): Subscription {
    const campaignSettings = campaignForm.get('settings');
    return campaignForm.valueChanges
      .pipe(
        debounceTime(CampaignDraftApiService.DRAFT_SAVE_INTERVAL),
        switchMap(() => {
          if (campaignSettings.valid) {
            const payload: any = {
              adAccount: campaignSettings.value.account,
              provider: campaignSettings.value.provider,
              name: campaignSettings.value.name,
              draft: campaignForm.value,
            };
            if (campaignDraftId) {
              payload.id = campaignDraftId.value?.draftId;
            }
            return this.create({ payload }).pipe(
              tap((resp) => {
                campaignDraftId.next({
                  draftId: resp.id,
                  provider: resp.provider,
                });
              }),
            );
          }
          return of();
        }),
      )
      .subscribe();
  }
}
