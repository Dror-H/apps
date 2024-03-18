import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { Observable } from 'rxjs';
import {
  LinkedinBidSuggestionsDto,
  FacebookCampaignDraft,
  LinkedinCampaignDraft,
} from '@instigo-app/data-transfer-object';

@Injectable()
export class NewCampaignService {
  constructor(private readonly campaignApiService: CampaignApiService) {}

  public create(newCampaignForm: FormGroup, campaignDraftId: string): Observable<FacebookCampaignDraft> {
    return this.campaignApiService.create({
      payload: { campaign: newCampaignForm.value, campaignDraftId: campaignDraftId },
    });
  }

  public getLinkedinBidSuggestions(campaign: LinkedinCampaignDraft): Observable<LinkedinBidSuggestionsDto> {
    return this.campaignApiService.getLinkedinBidSuggestions(campaign);
  }
}
