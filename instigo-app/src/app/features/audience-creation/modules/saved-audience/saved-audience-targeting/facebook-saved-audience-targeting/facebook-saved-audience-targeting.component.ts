import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { extractValueFromRules } from '@app/shared/shared/values-in-targeting-rules.helper';
import {
  AudienceDto,
  AudienceSubType,
  instigoTargetingDetailsSpecTypes,
  InstigoTargetingTypes,
  SupportedProviders,
  TargetingAndDto,
  TargetingDto,
  TargetingExcludeDto,
  TargetingTemplateState,
} from '@instigo-app/data-transfer-object';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { fromAgeHigherThanToAgeValidator } from '@app/shared/shared/custom-form.validators';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-facebook-saved-audience-targeting',
  templateUrl: './facebook-saved-audience-targeting.component.html',
})
export class FacebookSavedAudienceTargetingComponent implements OnInit, OnDestroy {
  @Input() audienceForm: FormGroup;
  @Input() adAccountControl: FormControl;
  @ViewSelectSnapshot(WorkspaceState.adAccountsFormList) public adNetworks: any;

  public rulesValue: TargetingDto = null;
  public provider = SupportedProviders.FACEBOOK;
  public includeDetailsTargeting: TargetingAndDto[];
  public excludeDetailsTargeting: TargetingExcludeDto;
  public demographicsForm: FormGroup;
  public audienceList: AudienceDto[] = [];
  public audienceTypes = AudienceSubType;
  public excludeCustomAudience = false;
  public existingLocationType: string;
  public isCampaignCreation = false;
  public supportedProviders = SupportedProviders;
  public adAccount: FormControl;
  public showDetailedTargeting = true;
  public shouldLoadMore: boolean;
  public locationIncluded = {
    or: {},
  };
  public locationExcluded = {
    or: {},
  };

  private subSink = new SubSink();

  constructor(private readonly fb: FormBuilder, private readonly targetingService: TargetingApiService) {
    this.initValues();
  }

  @Input()
  public set rules(rules: TargetingDto) {
    if (rules) {
      this.initValues();
      this.rulesValue = rules;
      this.setFormWithExistingValuesFromRule(rules);
      this.setExistingDetailsTargeting(rules);
    }
  }

  ngOnInit() {
    this.isCampaignCreation = this.audienceForm.value.isCampaignCreation || false;
    this.adAccount = this.adAccountControl || (this.audienceForm.get('adAccount') as FormControl);

    this.listenOnDemoGraphicsFormChangesAndUpdateTheParentForm();
    this.listenOnDemographicsCustomAudienceIncludeIfNotCampCreationAndShowDetailedTargeting();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  onTargetChange(): void {
    this.dispatchGetTargetReach();
  }

  public getReachEventFromChild($event: {
    locationIncluded: TargetingAndDto;
    locationExcluded: TargetingExcludeDto;
  }): void {
    this.locationIncluded = $event.locationIncluded;
    this.locationExcluded = $event.locationExcluded;

    this.dispatchGetTargetReach();
  }

  private dispatchGetTargetReach(): void {
    const target = this.buildTarget();
    this.updateReach(this.provider, target);
  }

  private updateReach(provider, target): Subscription {
    this.audienceForm.controls.target.setValue(target);
    if (this.demographicsForm.invalid) {
      this.audienceForm.controls.target.setErrors(this.demographicsForm.errors);
      this.audienceForm.controls.reach.setValue(null);
      return;
    }
    return this.targetingService
      .reach({
        adAccountId: this.adAccount.value.providerId,
        provider,
        targeting: target,
      })
      .subscribe((data) => {
        this.audienceForm.controls.reach.setValue(data);
      });
  }

  private buildTarget(): TargetingTemplateState {
    const { gender, fromAge, locales, toAge, detailedTargeting, customAudiences, facebookConnections } =
      this.demographicsForm.value;
    const ageDemographics = {
      or: {
        [InstigoTargetingTypes.AGE_RANGE]: [
          {
            providerId: `(${fromAge},${toAge})`,
          },
        ],
      },
    };

    const localeDemographics = {
      or: {
        [InstigoTargetingTypes.LOCALES]: [
          {
            providerId: locales,
          },
        ],
      },
    };

    const genderDemographics = {
      or: {
        [InstigoTargetingTypes.GENDERS]: [
          {
            providerId: [gender],
          },
        ],
      },
    };

    const detailedTargetingDemographics = {
      or: {
        [InstigoTargetingTypes.TARGETING_OPTIMIZATION]: [
          {
            providerId: detailedTargeting,
          },
        ],
      },
    };

    const customAudiencesDemographicsInclude = {
      or: {
        [InstigoTargetingTypes.CUSTOM_AUDIENCES]: customAudiences.include,
      },
    };

    const customAudiencesDemographicsExclude = {
      or: {
        [InstigoTargetingTypes.CUSTOM_AUDIENCES]: customAudiences.exclude,
      },
    };

    const facebookConnectionsDemographics = {
      or: {
        [InstigoTargetingTypes.FACEBOOK_CONNECTIONS]: facebookConnections,
      },
    };

    const target = new TargetingTemplateState({ provider: this.provider });
    target.include.and = [
      this.locationIncluded,
      ageDemographics as any,
      localeDemographics,
      genderDemographics as any,
      detailedTargetingDemographics,
      customAudiencesDemographicsInclude,
      facebookConnectionsDemographics,
      ...this.includeDetailsTargeting,
    ];
    target.exclude = {
      or: {
        ...this.locationExcluded.or,
        ...this.excludeDetailsTargeting.or,
        ...customAudiencesDemographicsExclude.or,
      },
    };
    return target;
  }

  private setExistingDetailsTargeting(rules: TargetingDto): void {
    const includedDetailsTargeting = JSON.parse(JSON.stringify(this.extractIncludedDetailsTargeting(rules)));
    const excludedDetailsTargeting = this.extractExcludeDetailsTargeting(rules);
    this.includeDetailsTargeting = includedDetailsTargeting;
    this.excludeDetailsTargeting = excludedDetailsTargeting;
  }

  private setFormWithExistingValuesFromRule(rules: TargetingDto): void {
    this.setExistingCustomAudiencesFromRule(rules);
    this.setExistingAgeRangeFromRule(rules);
    const gender: string = extractValueFromRules(rules, InstigoTargetingTypes.GENDERS);
    this.demographicsForm.get('gender').patchValue(gender);
    const locales: string[] = extractValueFromRules(rules, InstigoTargetingTypes.LOCALES);
    this.demographicsForm.get('locales').setValue(locales);
    const targetingOptimization: boolean = extractValueFromRules(rules, InstigoTargetingTypes.TARGETING_OPTIMIZATION);
    this.demographicsForm.get('detailedTargeting').patchValue(targetingOptimization);
  }

  private setExistingAgeRangeFromRule(rules: TargetingDto): void {
    const ageRange: { fromAge: number; toAge: number } = extractValueFromRules(rules, InstigoTargetingTypes.AGE_RANGE);
    this.demographicsForm.get('fromAge').patchValue(ageRange.fromAge);
    this.demographicsForm.get('toAge').patchValue(ageRange.toAge);
  }

  private setExistingCustomAudiencesFromRule(rules: TargetingDto): void {
    const includeCustomAudiences = extractValueFromRules(rules, InstigoTargetingTypes.CUSTOM_AUDIENCES);
    const excludeCustomAudiences = extractValueFromRules(rules, InstigoTargetingTypes.CUSTOM_AUDIENCES, 'exclude');
    if (includeCustomAudiences != null) {
      this.demographicsForm.get('customAudiences.include').setValue([...includeCustomAudiences]);
    }
    if (excludeCustomAudiences != null) {
      this.demographicsForm.get('customAudiences.exclude').patchValue([...excludeCustomAudiences]);
      this.excludeCustomAudience = true;
    }
  }

  private extractIncludedDetailsTargeting(rules: TargetingDto): TargetingAndDto[] {
    const detailsTargeting: InstigoTargetingTypes[] = instigoTargetingDetailsSpecTypes;
    let detailsTargetingList: TargetingAndDto[] = [{ or: {} }];
    rules.include.and.forEach((and: TargetingAndDto) => {
      if (Object.keys(and.or).some((key: InstigoTargetingTypes) => detailsTargeting.includes(key))) {
        detailsTargetingList = [...detailsTargetingList, and];
      }
    });
    return detailsTargetingList;
  }

  private extractExcludeDetailsTargeting(rules: TargetingDto): TargetingExcludeDto {
    const detailsTargeting: InstigoTargetingTypes[] = instigoTargetingDetailsSpecTypes;
    const detailsTargetingList: TargetingExcludeDto = rules?.exclude != null ? { ...rules.exclude } : { or: {} };

    const auxDetailedTargetingList = { or: {} };
    Object.keys(detailsTargetingList.or).forEach((key: InstigoTargetingTypes) => {
      if (detailsTargeting.includes(key)) {
        auxDetailedTargetingList.or[key] = detailsTargetingList.or[key];
      }
    });
    return auxDetailedTargetingList;
  }

  private initValues(): void {
    this.demographicsForm = this.fb.group(
      {
        customAudiences: this.fb.group({
          include: [[]],
          exclude: [[]],
        }),
        locales: this.fb.control(null),
        gender: ['0', Validators.required],
        fromAge: [18, [Validators.required, Validators.min(13), Validators.max(65)]],
        toAge: [65, [Validators.required, Validators.min(13), Validators.max(65)]],
        detailedTargeting: [false],
        facebookConnections: [[]],
      },
      { validators: fromAgeHigherThanToAgeValidator } as AbstractControlOptions,
    );

    this.includeDetailsTargeting = [
      {
        or: {},
      },
    ];

    this.excludeDetailsTargeting = {
      or: {},
    };
  }

  private listenOnDemoGraphicsFormChangesAndUpdateTheParentForm(): void {
    this.subSink.sink = this.demographicsForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.dispatchGetTargetReach();
    });
  }

  private listenOnDemographicsCustomAudienceIncludeIfNotCampCreationAndShowDetailedTargeting(): void {
    if (!this.isCampaignCreation) {
      this.subSink.sink = this.demographicsForm
        .get('customAudiences.include')
        .valueChanges.pipe(startWith(this.demographicsForm.get('customAudiences.include').value))
        .subscribe(
          (change) =>
            (this.showDetailedTargeting = change.find((item) => item.type === this.audienceTypes.LOOKALIKE) != null),
        );
    }
  }
}
