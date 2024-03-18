import {
  audienceSourceOptions,
  AudienceType,
  BudgetType,
  CampaignStatusType,
  FacebookBidStrategyEnum,
  FacebookCreativeSource,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { budgetValidator, rangeValidator } from '@app/shared/shared/custom-form.validators';
import { Injectable } from '@angular/core';
import {
  existingPostsTypeOptions,
  postTypeOptions,
} from '@app/pages/new-campaign/facebook-new-campaign/facebook-new-campaign.data';
import { FacebookAdTemplateGeneratorService } from './facebook-ad-template-generator.service';

@Injectable()
export class FacebookNewCampaignFormCreatorManagerService {
  constructor(private fb: FormBuilder, private adTemplateGenerator: FacebookAdTemplateGeneratorService) {}

  public createForm(): FormGroup {
    const timeNow = new Date();
    return this.fb.group(
      {
        settings: this.fb.group({
          account: [null, [Validators.required]],
          name: [null, [Validators.required, Validators.minLength(4), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
          buyingType: ['auction', [Validators.required]],
          objective: [null, [Validators.required]],
          specialCats: [false],
          specialCatsOptions: [null],
          provider: [SupportedProviders.FACEBOOK],
          status: [CampaignStatusType.PAUSED],
        }),
        creatives: this.fb.group({
          sourceType: FacebookCreativeSource.CREATE_NEW_VARIATIONS,
          existingPost: this.fb.group({
            postType: postTypeOptions[0].id,
            postSource: existingPostsTypeOptions[0].id,
            selectedPost: [null, [Validators.required]],
          }),
          existingTemplate: this.fb.group({
            adCombinations: [[], [Validators.required, Validators.min(1)]],
          }),
          multivariate: this.fb.group({
            adTemplateType: [],
            adCombinations: this.fb.control([]),
            image: this.adTemplateGenerator.generateMultiVariateImage(),
            carousel: this.adTemplateGenerator.generateMultiVariateCarousel(),
            video: this.adTemplateGenerator.generateMultiVariateVideo(),
          }),
        }),
        adSetFormat: this.fb.control([]),
        targeting: this.fb.group({
          targetingType: audienceSourceOptions[0].id,
          loadAudience: this.buildAudienceForm(true),
          createAudience: this.buildAudienceForm(),
        }),
        budget: this.fb.group(
          {
            budgetType: [BudgetType.DAILY],
            budget: [20],
            spendCap: [null],
            range: this.fb.group({
              startDate: [timeNow],
              startTime: [
                `${`0${timeNow.getHours()}`.slice(-2)}:${`0${timeNow.getMinutes()}`.slice(-2)}`,
                [Validators.pattern('[0-2][0-9]:[0-6][0-9]')],
              ],
              endDate: [null],
              endTime: [null, [Validators.pattern('[0-2][0-9]:[0-6][0-9]')]],
            }),
            useDayparting: [false],
            adSetSchedule: [null],
          },
          { validators: [rangeValidator] } as AbstractControlOptions,
        ),
        delivery: this.fb.group({
          optimizedFor: [null],
          bidStrategy: [FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP],
          costCap: [0.01, [Validators.min(0.01), Validators.required]],
          billingEvent: [null],
          acceleratedDelivery: [false],
          campaignBudgetOpti: [false],
          campaignCreativesOpti: [false],
          conversion: this.addConversionToDelivery(),
          reach: this.addReachToDelivery(),
        }),
      },
      { validators: [budgetValidator] } as AbstractControlOptions,
    );
  }

  private buildAudienceForm(isLoadAudience = false): FormGroup {
    const audienceSpec = {
      audienceType: [AudienceType.SAVED_AUDIENCE, [Validators.required]],
      audienceSubType: [null],
      provider: [SupportedProviders.FACEBOOK, [Validators.required]],
      description: [''],
      name: [''],
      reach: [null, [Validators.required]],
      target: [null, [Validators.required]],
      isCampaignCreation: [true],
    } as any;
    if (isLoadAudience) {
      audienceSpec.id = [null, [Validators.required]];
      audienceSpec.isTargeting = [false, [Validators.required]];
    }
    return this.fb.group(audienceSpec);
  }

  private addConversionToDelivery(): FormGroup {
    const newConversionForm = this.fb.group({
      conversionEvents: ['PURCHASE', [Validators.required]],
      conversionPixel: [null, [Validators.required]],
    });
    newConversionForm.disable();
    return newConversionForm;
  }

  private addReachToDelivery(): FormGroup {
    const newReachForm = this.fb.group({
      intervalDays: [1, [Validators.required, Validators.min(1), Validators.max(90)]],
      maxFrequency: [7, [Validators.required, Validators.min(1), Validators.max(90)]],
    });
    newReachForm.disable();
    return newReachForm;
  }
}
