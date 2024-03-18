import { Injectable } from '@angular/core';
import { SubSink } from 'subsink';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import { FormGroup } from '@angular/forms';
import { FacebookCampaignDraft, SupportedProviders } from '@instigo-app/data-transfer-object';
import { LinkedinNewCampaignFormCreatorManagerService } from '@app/pages/new-campaign/linkedin-new-campaign/services/linkedin-new-campaign-form-creator-manager.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LinkedinNewCampaignBackgroundFormService {
  public campaignForm: FormGroup;
  public campaignDraftId = new BehaviorSubject<{ draftId: string; provider: SupportedProviders }>(null);
  private subSink = new SubSink();

  constructor(
    private readonly draftService: CampaignDraftApiService,
    private readonly formService: LinkedinNewCampaignFormCreatorManagerService,
  ) {
    this.createForm();
  }

  public patchDraft(campaignDraft: FacebookCampaignDraft): void {
    this.campaignForm.get('settings').patchValue(campaignDraft.settings);
    this.campaignForm.get('creatives').patchValue(campaignDraft.creatives);
    this.campaignForm.get('targeting').patchValue(campaignDraft.targeting);
    this.campaignForm.get('budget').patchValue(campaignDraft.budget);
  }

  public listenOnCampaignChangesAndSaveDraft() {
    this.subSink.sink = this.draftService.listenOnCampaignChangesAndSaveDraft(this.campaignForm, this.campaignDraftId);
  }

  private createForm(): void {
    this.campaignForm = this.formService.createForm();
  }
}
