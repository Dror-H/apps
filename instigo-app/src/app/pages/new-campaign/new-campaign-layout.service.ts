import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { CampaignResult } from './facebook-new-campaign/components/campaign-result/campaign-result.component';

@Injectable()
export class NewCampaignLayoutService {
  public loadingOnCampaignCreate$ = new BehaviorSubject<boolean>(false);
  public campaignResult$ = new BehaviorSubject<CampaignResult>(null);
  public campaignData$ = new BehaviorSubject<LayoutCampaignData>(null);
  public hasRestarted = new BehaviorSubject<boolean>(false);

  public updateCampaignData(payload: Partial<LayoutCampaignData>): void {
    let campaignDataValue = this.campaignData$.value;
    campaignDataValue = { ...campaignDataValue, ...payload };
    this.campaignData$.next(campaignDataValue);
  }

  public deleteAll(): void {
    this.loadingOnCampaignCreate$.next(false);
    this.campaignResult$.next(null);
    this.campaignData$.next(null);
  }
}

export interface LayoutCampaignData {
  name: string;
  provider: SupportedProviders;
  draftId: string;
}
