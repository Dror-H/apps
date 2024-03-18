import { Injectable, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CampaignDraftApiService } from '@app/api/services/campaign-draft.api.service';
import {
  biddingStrategies,
  facebookCampaignObjectives,
  optimizationGoals,
} from '@app/pages/new-campaign/facebook-new-campaign/facebook-new-campaign.data';
import {
  AdTemplateType,
  audienceSourceOptions,
  CreativeSettings,
  FacebookBidStrategyEnum,
  FacebookCampaignDraft,
  FacebookCreativeSource,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { BehaviorSubject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { FacebookNewCampaignFormCreatorManagerService } from './facebook-new-campaign-form-creator-manager.service';
import { isArray } from 'lodash-es';
import { enableOrDisableMultivariateFields } from '@app/global/utils';

@Injectable()
export class FacebookNewCampaignBackgroundFormService implements OnDestroy {
  public campaignForm: FormGroup;
  public campaignDraftId = new BehaviorSubject<{ draftId: string; provider: SupportedProviders }>(null);
  private subSink = new SubSink();

  constructor(
    private campaignCreatorManager: FacebookNewCampaignFormCreatorManagerService,
    private readonly draftService: CampaignDraftApiService,
  ) {
    this.createForm();
    this.listenOnSpecialCatsAndUpdateOptions();
    this.selectDefaultOptimizationGoal();
    this.creativesSourceAndTemplateTypeListener();
    this.targetingSourceListener();
    this.listenOnCampaignObjectiveAndUpdateCreatives();
  }

  public get campaignSettings(): FormGroup {
    return this.campaignForm.get('settings') as FormGroup;
  }

  public get campaignCreatives(): FormGroup {
    return this.campaignForm.get('creatives') as FormGroup;
  }

  public get campaignTargetings(): FormGroup {
    return this.campaignForm.get('targeting') as FormGroup;
  }

  public get deliverySettings(): FormGroup {
    return this.campaignForm.get('delivery') as FormGroup;
  }

  public patchDraft(campaignDraft: FacebookCampaignDraft): void {
    this.campaignForm.get('settings').patchValue(campaignDraft.settings);
    this.campaignForm.get('creatives').patchValue(campaignDraft.creatives);

    if (campaignDraft.creatives.sourceType === FacebookCreativeSource.CREATE_NEW_VARIATIONS) {
      this.patchCreativeMultivariateArrays(campaignDraft.creatives);
    }

    this.campaignForm.get('adSetFormat').patchValue(campaignDraft.adSetFormat);
    this.campaignForm.get('targeting').patchValue(campaignDraft.targeting);
    this.campaignForm.get('budget').patchValue(campaignDraft.budget);
    this.campaignForm.get('delivery').patchValue(campaignDraft.delivery, { emitEvent: false });
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  public listenOnCampaignChangesAndSaveDraft() {
    this.subSink.sink = this.draftService.listenOnCampaignChangesAndSaveDraft(this.campaignForm, this.campaignDraftId);
  }

  private patchCreativeMultivariateArrays(creativesDraft: CreativeSettings) {
    const adTemplateType = creativesDraft.multivariate.adTemplateType.toLowerCase();
    const adTemplateTypeValue = creativesDraft.multivariate[adTemplateType];

    for (const key in adTemplateTypeValue) {
      const formArray = this.campaignForm.get(`creatives.multivariate.${adTemplateType}.${key}`) as FormArray;

      if (
        isArray(adTemplateTypeValue[key]) &&
        adTemplateTypeValue[key].length > 1 &&
        formArray instanceof FormArray &&
        key !== 'childAttachments'
      ) {
        for (let i = 0; i <= adTemplateTypeValue[key].length - formArray.length; i++) {
          formArray.push(new FormControl(null));
        }
        formArray.setValue(adTemplateTypeValue[key]);
      }
    }
  }

  private createForm(): void {
    this.campaignForm = this.campaignCreatorManager.createForm();
  }

  private listenOnCampaignObjectiveAndUpdateCreatives(): void {
    this.subSink.sink = this.campaignSettings
      .get('objective')
      .valueChanges.pipe(startWith(this.campaignSettings.get('objective').value))
      .subscribe((objective) => {
        this.deliverySettings.get('campaignCreativesOpti').enable();
        switch (objective) {
          case 'VIDEO_VIEWS': {
            this.campaignCreatives.get('multivariate.adTemplateType').setValue(AdTemplateType.VIDEO);
            this.campaignCreatives.get('sourceType').setValue(FacebookCreativeSource.CREATE_NEW_VARIATIONS);
            break;
          }
          case 'BRAND_AWARENESS': {
            this.campaignForm.get('delivery.bidStrategy').setValue(FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP);
            break;
          }
          case 'POST_ENGAGEMENT': {
            this.campaignForm.get('delivery.bidStrategy').setValue(FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP);
            this.campaignCreatives.get('sourceType').setValue(FacebookCreativeSource.USE_POSTS);
            break;
          }
          case 'PAGE_LIKES': {
            if (this.campaignCreatives.get('multivariate.adTemplateType').value === AdTemplateType.CAROUSEL) {
              this.campaignCreatives.get('multivariate.adTemplateType').setValue(AdTemplateType.IMAGE);
            }
            this.deliverySettings.get('campaignCreativesOpti').setValue(false);
            this.deliverySettings.get('campaignCreativesOpti').disable();
            this.campaignCreatives.get('sourceType').setValue(FacebookCreativeSource.CREATE_NEW_VARIATIONS);
            break;
          }
          case 'EVENT_RESPONSES': {
            if (this.campaignCreatives.get('multivariate.adTemplateType').value === AdTemplateType.CAROUSEL) {
              this.campaignCreatives.get('multivariate.adTemplateType').setValue(AdTemplateType.IMAGE);
            }
            this.campaignCreatives.get('sourceType').setValue(FacebookCreativeSource.CREATE_NEW_VARIATIONS);
            break;
          }
          default: {
            this.campaignCreatives.get('sourceType').setValue(FacebookCreativeSource.CREATE_NEW_VARIATIONS);
          }
        }
      });
  }

  private listenOnSpecialCatsAndUpdateOptions(): void {
    this.subSink.sink = this.campaignSettings.get('specialCats').valueChanges.subscribe((change) => {
      if (change === false) {
        this.campaignSettings.get('specialCatsOptions').setValue(null);
      }
    });
  }

  private selectDefaultOptimizationGoal(): void {
    this.subSink.sink = this.campaignSettings.get('objective').valueChanges.subscribe((objective) => {
      const campaignObjective = facebookCampaignObjectives.find((item) => item.value === objective);
      this.deliverySettings.get('optimizedFor').setValue(campaignObjective.defaultOptimizationGoal);
      if (campaignObjective.defaultOptimizationGoal === 'OFFSITE_CONVERSIONS') {
        this.deliverySettings.get('conversion').enable();
      } else {
        this.deliverySettings.get('conversion').disable();
      }
    });
    this.subSink.sink = this.deliverySettings
      .get('optimizedFor')
      .valueChanges.pipe(startWith(this.deliverySettings.get('optimizedFor').value))
      .subscribe((value) => {
        if (value) {
          this.deliverySettings
            .get('billingEvent')
            .setValue(optimizationGoals.find((item) => item.id === value).billingEvents[0].id);
          if (value === 'REACH') {
            this.deliverySettings.get('reach').enable();
          } else {
            this.deliverySettings.get('reach').disable();
          }
        }
      });
    this.deliverySettings.get('bidStrategy').setValue(biddingStrategies[0].id);
  }

  private creativesSourceAndTemplateTypeListener(): void {
    this.subSink.sink = this.campaignCreatives
      .get('sourceType')
      .valueChanges.pipe(
        startWith(this.campaignCreatives.get('sourceType').value),
        map((sourceType: number) => {
          switch (sourceType) {
            case FacebookCreativeSource.CREATE_NEW_VARIATIONS: {
              this.campaignCreatives.get('multivariate').enable();
              enableOrDisableMultivariateFields(
                this.campaignCreatives.get('multivariate') as FormGroup,
                this.campaignCreatives.get('multivariate.adTemplateType').value,
                this.campaignCreatives.parent.get('settings.objective').value,
              );
              this.campaignCreatives.get('existingTemplate').disable();
              this.campaignCreatives.get('existingPost').disable();
              break;
            }
            case FacebookCreativeSource.USE_EXISTING_TEMPLATES: {
              this.campaignCreatives.get('multivariate').disable();
              this.campaignCreatives.get('existingTemplate').enable();
              this.campaignCreatives.get('existingPost').disable();
              break;
            }
            case FacebookCreativeSource.USE_POSTS: {
              this.campaignCreatives.get('multivariate').disable();
              this.campaignCreatives.get('existingTemplate').disable();
              this.campaignCreatives.get('existingPost').enable();
              break;
            }
            case FacebookCreativeSource.ONLY_PROMOTE_PAGE: {
              this.campaignCreatives.get('multivariate').disable();
              this.campaignCreatives.get('existingTemplate').disable();
              this.campaignCreatives.get('existingPost').disable();
              break;
            }
          }
          return sourceType;
        }),
      )
      .subscribe();
  }

  private targetingSourceListener() {
    this.subSink.sink = this.campaignTargetings
      .get('targetingType')
      .valueChanges.pipe(
        startWith(this.campaignTargetings.get('targetingType').value),
        tap((change) => {
          if (change === audienceSourceOptions[0].id) {
            this.campaignTargetings.get('createAudience').enable();
            this.campaignTargetings.get('loadAudience').disable();
          } else {
            this.campaignTargetings.get('createAudience').disable();
            this.campaignTargetings.get('loadAudience').enable();
          }
        }),
      )
      .subscribe();
  }
}
