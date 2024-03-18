import { Component } from '@angular/core';
import { LinkedinNewCampaignFormCreatorManagerService } from './services/linkedin-new-campaign-form-creator-manager.service';
import { FormGroup } from '@angular/forms';
import { NewCampaignLayoutService } from '@app/pages/new-campaign/new-campaign-layout.service';
import { NewCampaignService } from '@app/pages/new-campaign/services/new-campaign.service';
import { LinkedinAdTemplateGeneratorService } from '@app/pages/new-campaign/linkedin-new-campaign/services/linkedin-ad-template-generator.service';
import { take } from 'rxjs/operators';
import { CampaignDraftDTO } from '@instigo-app/data-transfer-object';
import { ActivatedRoute } from '@angular/router';
import { LinkedinNewCampaignBackgroundFormService } from '@app/pages/new-campaign/linkedin-new-campaign/services/linkedin-new-campaign-background-form.service';

@Component({
  selector: 'ingo-linkedin-new-campaign',
  templateUrl: './linkedin-new-campaign.component.html',
  styleUrls: ['./linkedin-new-campaign.component.scss'],
  providers: [
    LinkedinNewCampaignBackgroundFormService,
    LinkedinNewCampaignFormCreatorManagerService,
    LinkedinAdTemplateGeneratorService,
  ],
})
export class LinkedinNewCampaignComponent {
  public step = 0;
  public campaignForm: FormGroup;
  public isOverviewActive = false;

  constructor(
    private readonly layoutService: NewCampaignLayoutService,
    private readonly newCampaignService: NewCampaignService,
    private readonly newCampaignFormService: LinkedinNewCampaignBackgroundFormService,
    private readonly route: ActivatedRoute,
  ) {
    this.createForm();
  }

  public setStep(step: number): void {
    this.step = step;
  }

  public toggleOverview(toggleState: boolean): void {
    this.isOverviewActive = toggleState;
  }

  public createCampaign(): void {
    this.layoutService.loadingOnCampaignCreate$.next(true);
    this.layoutService.updateCampaignData({ name: this.campaignForm.value.settings.name });

    this.newCampaignService
      .create(this.campaignForm, this.newCampaignFormService.campaignDraftId.value.draftId)
      .subscribe(
        (result) => {
          this.layoutService.campaignResult$.next({
            title: 'app.campCreate.campaign.campCreated',
            descriptionId: 'app.campCreate.campaign.campCreatedDescription',
            type: 'success',
            campaign: result,
          });
        },
        (err) => {
          this.layoutService.campaignResult$.next({
            title: 'app.campCreate.campaign.campError',
            descriptionId: 'app.campCreate.campaign.campErrorDescription',
            type: 'error',
            campaign: this.campaignForm.value,
            error: err.error.error,
          });
        },
      );
  }

  private createForm(): void {
    this.campaignForm = this.newCampaignFormService.campaignForm;
    this.setCampaignDraftIdAndPatchDraft();
  }

  private setCampaignDraftIdAndPatchDraft(): void {
    this.route.data.pipe(take(1)).subscribe((campaignDraft: CampaignDraftDTO) => {
      if (campaignDraft[0] && campaignDraft[0] && !this.layoutService.hasRestarted.value) {
        this.layoutService.campaignResult$.next(null);
        this.newCampaignFormService.campaignDraftId.next({
          draftId: campaignDraft[0].id,
          provider: campaignDraft[0].provider,
        });
        this.layoutService.updateCampaignData(this.newCampaignFormService.campaignDraftId.value);
        this.newCampaignFormService.patchDraft(campaignDraft[0].draft);
      }
      this.newCampaignFormService.listenOnCampaignChangesAndSaveDraft();
    });
  }
}
