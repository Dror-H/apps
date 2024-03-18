import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AdTemplateType,
  AudienceType,
  BudgetType,
  CampaignStatusType,
  LinkedinCostType,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { LinkedinAdTemplateGeneratorService } from '@app/pages/new-campaign/linkedin-new-campaign/services/linkedin-ad-template-generator.service';
import { rangeValidator } from '@app/shared/shared/custom-form.validators';

@Injectable()
export class LinkedinNewCampaignFormCreatorManagerService {
  constructor(private fb: FormBuilder, private adTemplateGenerator: LinkedinAdTemplateGeneratorService) {}

  public createForm(): FormGroup {
    const timeNow = new Date();
    return this.fb.group({
      settings: this.fb.group({
        provider: [SupportedProviders.LINKEDIN],
        objective: [null, [Validators.required]],
        name: [null, [Validators.required, Validators.minLength(4), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        account: [null, [Validators.required]],
        campaignGroup: [null, [Validators.required]],
        type: ['TEXT_AD', [Validators.required]],
        status: [CampaignStatusType.PAUSED, [Validators.required]],
      }),
      creatives: this.fb.group({
        multivariate: this.fb.group({
          adCombinations: this.fb.control([]),
          adTemplateType: [AdTemplateType.IMAGE],
          image: this.adTemplateGenerator.generateMultiVariateImage(),
        }),
        adSetFormat: this.fb.control(['WEBCONVERSION_DESKTOP']),
      }),
      targeting: this.fb.group({
        locale: ['en_US', [Validators.required]],
        targetingCriteria: this.fb.group(
          {
            audienceType: [AudienceType.SAVED_AUDIENCE, [Validators.required]],
            audienceSubType: [null],
            adAccount: [null, [Validators.required]],
            provider: [SupportedProviders.LINKEDIN, [Validators.required]],
            reach: [''],
            target: [],
          },
          [Validators.required],
        ),
      }),
      budget: this.fb.group(
        {
          range: this.fb.group({
            startDate: [timeNow],
            startTime: [
              `${`0${timeNow.getHours()}`.substr(-2)}:${`0${timeNow.getMinutes()}`.substr(-2)}`,
              [Validators.pattern('[0-2][0-9]:[0-6][0-9]')],
            ],
            endDate: [null],
            endTime: [null, [Validators.pattern('[0-2][0-9]:[0-6][0-9]')]],
          }),
          costType: [LinkedinCostType.CPC, [Validators.required]],
          budgetType: [BudgetType.DAILY, [Validators.required]],
          budget: [null, [Validators.required, Validators.min(0)]],
          spendCap: [null, [Validators.required, Validators.min(0)]],
        },
        { validators: [rangeValidator] } as AbstractControlOptions,
      ),
    });
  }
}
