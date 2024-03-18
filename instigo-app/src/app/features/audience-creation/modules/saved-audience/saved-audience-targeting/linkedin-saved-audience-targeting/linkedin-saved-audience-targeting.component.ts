import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  InstigoTargetingTypes,
  SearchOutputDto,
  SupportedProviders,
  TargetingAndDto,
  TargetingDto,
  TargetingExcludeDto,
  TargetingTemplateState,
} from '@instigo-app/data-transfer-object';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TargetingApiService } from '@app/api/services/target-template.api.service';

@Component({
  selector: 'app-linkedin-saved-audience-targeting',
  templateUrl: './linkedin-saved-audience-targeting.component.html',
})
export class LinkedinSavedAudienceTargetingComponent implements OnInit, OnDestroy {
  @Input() audienceTypeForm: FormGroup;
  public provider = SupportedProviders.LINKEDIN;
  public includeDetailsTargeting: TargetingAndDto[];
  public excludeDetailsTargeting: TargetingExcludeDto;
  public locationIncluded: TargetingAndDto;
  public locationExcluded: TargetingExcludeDto;
  public demographicsForm: FormGroup;

  public locationType: InstigoTargetingTypes.GEOLOCATION | InstigoTargetingTypes.PROFILE_LOCATIONS =
    InstigoTargetingTypes.GEOLOCATION;
  public locationSelector$: ReplaySubject<any> = new ReplaySubject<any>();
  public selectedLocations: SearchOutputDto[] = [];
  public rulesValue: TargetingDto = null;
  public customAudienceIncluded;
  public customAudienceExcluded;

  private subSink = new SubSink();

  constructor(private readonly targetingService: TargetingApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.rulesValue = this.audienceTypeForm.value.target;
    this.initValues();
    if (this.rulesValue) {
      this.setExistingDetailsTargeting(this.rulesValue);
      this.setExistingCustomAudiencesFromRule(this.rulesValue);
    }
    this.subSink.sink = this.locationSelector$.pipe(debounceTime(500)).subscribe(() => {
      this.dispatchGetTargetReach();
    });
    this.listenOnDemoGraphicsFormChangesAndUpdateTheParentForm();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public getReachEventFromChild($event: {
    locationIncluded: TargetingAndDto;
    locationExcluded: TargetingExcludeDto;
  }): void {
    this.locationIncluded = $event.locationIncluded;
    this.locationExcluded = $event.locationExcluded;

    this.dispatchGetTargetReach();
  }

  public showDetails(): boolean {
    return (
      this.audienceTypeForm.controls.adAccount.value != null &&
      this.audienceTypeForm.controls.provider.value === SupportedProviders.LINKEDIN
    );
  }

  public dispatchGetTargetReach() {
    const { target, provider } = this.buildTarget();
    this.updateReach(provider, target);
  }

  private setExistingDetailsTargeting(rules: TargetingDto) {
    this.includeDetailsTargeting = [{ or: this.extractIncludedDetailsTargeting(rules) }];
    this.excludeDetailsTargeting = this.extractExcludeDetailsTargeting(rules);
  }

  private setExistingCustomAudiencesFromRule(rules: TargetingDto) {
    const includeCustomAudiences = rules.include.and[2]?.or[InstigoTargetingTypes.CUSTOM_AUDIENCES];
    const excludeCustomAudiences = rules.exclude?.or[InstigoTargetingTypes.CUSTOM_AUDIENCES];
    if (includeCustomAudiences != null) {
      this.demographicsForm.get('customAudiences.include').setValue([...includeCustomAudiences]);
    }
    if (excludeCustomAudiences != null) {
      this.demographicsForm.get('customAudiences.exclude').patchValue([...excludeCustomAudiences]);
    }
  }

  private extractIncludedDetailsTargeting(rules: TargetingDto) {
    let detailsTargetingList = {};
    const targetingKeys = rules.include.and[1].or;
    Object.keys(targetingKeys).forEach((key: string) => {
      detailsTargetingList = { ...detailsTargetingList, [key]: targetingKeys[key] };
    });
    return detailsTargetingList;
  }

  private extractExcludeDetailsTargeting(rules: TargetingDto): TargetingExcludeDto {
    const detailsTargetingList: TargetingExcludeDto = rules?.exclude != null ? { ...rules.exclude } : { or: {} };

    const auxDetailedTargetingList = { or: {} };
    Object.keys(detailsTargetingList.or).forEach((key: InstigoTargetingTypes) => {
      auxDetailedTargetingList.or[key] = detailsTargetingList.or[key];
    });
    return auxDetailedTargetingList;
  }

  private initValues(): void {
    this.demographicsForm = this.fb.group({
      customAudiences: this.fb.group({
        include: [[]],
        exclude: [[]],
      }),
    });

    this.includeDetailsTargeting = [
      {
        or: {},
      },
    ];

    this.excludeDetailsTargeting = {
      or: {},
    };

    this.locationIncluded = {
      or: {
        [this.locationType]: [],
      },
    };

    this.locationExcluded = {
      or: {
        [this.locationType]: [],
      },
    };

    this.customAudienceIncluded = [
      {
        or: {
          customAudiences: [],
        },
      },
    ];
    this.customAudienceExcluded = {
      or: {
        customAudiences: [],
      },
    };
  }

  private buildTarget() {
    const target = new TargetingTemplateState({ provider: this.provider });
    target.include.and = [this.locationIncluded, ...this.includeDetailsTargeting, ...this.customAudienceIncluded];
    target.exclude = {
      or: { ...this.locationExcluded.or, ...this.excludeDetailsTargeting.or, ...this.customAudienceExcluded.or },
    };
    return { target, provider: target.provider };
  }

  private updateReach(provider, target) {
    this.audienceTypeForm.controls.target.setValue(target);
    return this.targetingService
      .reach({
        adAccountId: this.audienceTypeForm.controls.adAccount.value.providerId,
        provider,
        targeting: target,
      })
      .subscribe((data) => {
        this.audienceTypeForm.controls.reach.setValue(data);
      });
  }

  private listenOnDemoGraphicsFormChangesAndUpdateTheParentForm(): void {
    this.subSink.sink = this.demographicsForm.valueChanges.pipe(debounceTime(500)).subscribe((change) => {
      this.serializeCustomAudienceChangeToModel(change);
      this.dispatchGetTargetReach();
    });
  }

  private serializeCustomAudienceChangeToModel(change) {
    this.customAudienceIncluded[0].or.customAudiences = change.customAudiences.include.map((item) => ({
      ...item,
    }));
    this.customAudienceExcluded.or.customAudiences = change.customAudiences.exclude.map((item) => ({
      ...item,
    }));
  }
}
