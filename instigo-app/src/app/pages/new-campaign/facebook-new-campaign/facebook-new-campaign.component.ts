import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { DisplayNotification, Notification, NotificationType } from '@app/global/display-notification.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FacebookNewCampaignBackgroundFormService } from './services/facebook-new-campaign-background-form.service';
import { FacebookNewCampaignFormCreatorManagerService } from './services/facebook-new-campaign-form-creator-manager.service';
import { NewCampaignService } from '../services/new-campaign.service';
import { take } from 'rxjs/operators';
import { CampaignDraftDTO, CampaignStatusType } from '@instigo-app/data-transfer-object';
import { ActivatedRoute } from '@angular/router';
import { NewCampaignLayoutService } from '@app/pages/new-campaign/new-campaign-layout.service';
import { FacebookAdTemplateGeneratorService } from './services/facebook-ad-template-generator.service';

@Component({
  selector: 'ingo-new-campaign',
  templateUrl: './facebook-new-campaign.component.html',
  styleUrls: ['./facebook-new-campaign.component.scss'],
  providers: [
    FacebookNewCampaignFormCreatorManagerService,
    FacebookNewCampaignBackgroundFormService,
    FacebookAdTemplateGeneratorService,
  ],
})
export class FacebookNewCampaignComponent implements OnInit {
  @SelectSnapshot(WorkspaceState.workspaceId)
  workspaceId: string;

  public campaignStatusType = CampaignStatusType;
  public campaignForm: FormGroup = new FormGroup({});
  public step = 0;
  public isOverviewActive = false;

  constructor(
    public readonly newCampaignFormService: FacebookNewCampaignBackgroundFormService,
    private readonly newCampaignService: NewCampaignService,
    private displayNotification: DisplayNotification,
    private adAccountApiService: AdAccountApiService,
    private layoutService: NewCampaignLayoutService,
    private readonly route: ActivatedRoute,
    private modal: NzModalService,
  ) {}

  private get status(): FormControl {
    return this.campaignForm.get('settings.status') as FormControl;
  }

  public setStep(step: number): void {
    this.step = step;
  }

  public toggleOverview(toggleState: boolean): void {
    this.isOverviewActive = toggleState;
  }

  public checkTOSAndCreateCampaign(): void {
    if (this.campaignForm.invalid) {
      this.displayNotification.displayNotification(
        new Notification({
          titleId: 'app.campCreate.campaign.campCreateFormErr',
          type: NotificationType.ERROR,
        }),
      );
      return;
    }

    if (this.campaignForm.value.settings.objective === 'LEAD_GENERATION') {
      this.checkIfPageHasLeadgenTOS(
        this.campaignForm.value.creatives.multivariate.adCombinations[0].social.promotePage,
      );
    } else {
      this.createCampaign();
    }
  }

  public setCampaignStatusAndTriggerCampCreation(status: CampaignStatusType): void {
    this.status.setValue(status);
    this.checkTOSAndCreateCampaign();
  }

  ngOnInit(): void {
    this.campaignForm = this.newCampaignFormService.campaignForm;
    this.setCampaignDraftIdAndPatchDraft();
    this.layoutService.updateCampaignData({ name: this.newCampaignFormService.campaignForm.value.settings.name });
  }

  private setCampaignDraftIdAndPatchDraft(): void {
    this.route.data.pipe(take(1)).subscribe((campaignDraft: CampaignDraftDTO) => {
      if (campaignDraft[0]) {
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

  private checkIfPageHasLeadgenTOS(pageProviderId: string): void {
    this.adAccountApiService
      .checkPageTos({ pageProviderId: pageProviderId })
      .subscribe((res: { leadgen_tos_accepted: boolean }) => {
        if (res.leadgen_tos_accepted) {
          this.createCampaign();
        } else {
          const tosLink = 'https://www.facebook.com/ads/leadgen/tos';
          this.modal.confirm({
            nzTitle: '<i>Accept Terms of Service</i>',
            nzContent: `<p>To continue, you have to accept the Terms of Service for the respective page.</p>`,
            nzOkText: 'Take me there',
            nzCancelText: 'Later',
            nzOnOk: () => window.open(tosLink, '_blank'),
          });
        }
      });
  }

  private createCampaign(): void {
    this.layoutService.loadingOnCampaignCreate$.next(true);
    this.layoutService.updateCampaignData({ name: this.newCampaignFormService.campaignForm.value.settings.name });

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
}
