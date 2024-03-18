import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AudienceService } from '@app/pages/audience/audience.service';
import {
  AudienceDto,
  AudienceType,
  isInstanceOfAudienceList,
  TargetingTemplateDto,
} from '@instigo-app/data-transfer-object';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-new-audience',
  templateUrl: './new-audience.component.html',
  styleUrls: ['./new-audience.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NewAudienceComponent implements OnInit {
  public step = 0;
  public typeSelectionValid = true;
  public audienceForm = new FormGroup({});
  public isOverviewActive = false;

  private subSink = new SubSink();

  constructor(private fb: FormBuilder, private audienceService: AudienceService, private router: Router) {}

  public get reach(): FormControl {
    return this.audienceForm.get('reach') as FormControl;
  }

  public get target(): FormControl {
    return this.audienceForm.get('target') as FormControl;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(e): any {
    if (this.isUnsavedChanges()) {
      e.returnValue = 'You have unsaved changes. Are you sure you want to close the page?';
      return e;
    }
  }

  ngOnInit(): void {
    this.audienceForm = this.fb.group({
      audienceType: [null, [Validators.required]],
      audienceSubType: [null, [Validators.required]],
      adAccount: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      description: [''],
      name: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      reach: [''],
      target: [],
    });

    this.subSink.sink = this.audienceForm.get('audienceType').valueChanges.subscribe((audienceType) => {
      if (audienceType === AudienceType.CUSTOM_AUDIENCE) {
        this.audienceForm.get('audienceSubType').enable();
      } else {
        this.audienceForm.get('audienceSubType').disable();
      }
    });
  }

  public toggleOverview(toggleState: boolean): void {
    this.isOverviewActive = toggleState;
  }

  public setStep(step: number): void {
    if (step === 1 && this.audienceForm.invalid) {
      this.typeSelectionValid = false;
      Object.keys(this.audienceForm.controls).forEach((key) => {
        this.audienceForm.controls[key].markAsDirty();
      });
      return;
    }
    this.typeSelectionValid = true;
    this.step = step;
  }

  public createAudiences(): void {
    switch (this.audienceForm.controls.audienceType.value) {
      case AudienceType.SAVED_AUDIENCE:
        this.createSavedAudience();
        break;
      case AudienceType.CUSTOM_AUDIENCE:
        this.createCustomAudiences();
        break;
      case AudienceType.LOOKALIKE_AUDIENCE:
        this.createLookalikeAudiences();
        break;
    }
  }

  public isUnsavedChanges(): boolean {
    return this.audienceForm.dirty;
  }

  private createSavedAudience(): void {
    const providers = this.audienceForm.controls.provider.value;
    const payload: Partial<TargetingTemplateDto>[] = [
      {
        name: this.audienceForm.controls.name.value,
        adAccount: this.audienceForm.controls.adAccount.value,
        type: this.audienceForm.controls.audienceType.value,
        provider: this.audienceForm.controls.provider.value,
        rules: this.target.value,
        size: this.reach.value.count,
      },
    ];
    this.audienceService.callApiSavedAudience(payload, providers).subscribe(this.goToAudiences.bind(this));
  }

  private addAudienceListOrRulesToPayload(payload: Partial<AudienceDto>[], listDataOrRules: any): void {
    if (isInstanceOfAudienceList(listDataOrRules)) {
      for (const audienceData of payload) {
        audienceData.audienceListData = listDataOrRules;
      }
    } else {
      for (const audienceData of payload) {
        audienceData.rules = listDataOrRules;
      }
    }
  }

  private createCustomAudiences(): void {
    const provider = this.audienceForm.controls.provider.value;
    const payload: Partial<AudienceDto>[] = [
      {
        name: this.audienceForm.controls.name.value,
        adAccount: this.audienceForm.controls.adAccount.value,
        description: this.audienceForm.controls.description.value,
        provider: this.audienceForm.controls.provider.value,
        type: this.audienceForm.controls.audienceType.value,
        subType: this.audienceForm.controls.audienceSubType.value,
      },
    ];
    this.addAudienceListOrRulesToPayload(payload, this.target.value);

    this.audienceService.callApiForLookalikeOrCustom(payload, provider).subscribe(this.goToAudiences.bind(this));
  }

  private createLookalikeAudiences(): void {
    const provider = this.audienceForm.controls.provider.value;
    const payload = this.audienceForm.controls.target.value.lookalikeSpecsList[provider].list.map((item) => {
      const countries = item.locationSpec.include.countries;
      const moreThan2Country =
        item.locationSpec.include.countries.length > 2
          ? `and ${item.locationSpec.include.countries.length - 2} others, `
          : '';
      const startingRatio = item.startingRatio === 0 ? '' : `${item.startingRatio * 100}% of`;
      return {
        name: `${this.audienceForm.controls.name.value} (${countries[0]}, ${
          countries[1]
        }, ${moreThan2Country} ${startingRatio} ${item.ratio * 100}%)`,
        adAccount: this.audienceForm.controls.adAccount.value,
        description: this.audienceForm.controls.description.value,
        provider: this.audienceForm.controls.provider.value,
        lookalikeSpec: item,
        type: this.audienceForm.controls.audienceType.value,
        subType: this.audienceForm.controls.audienceType.value,
      };
    });
    this.audienceService.callApiForLookalikeOrCustom(payload, provider).subscribe(this.goToAudiences.bind(this));
  }

  private goToAudiences(): void {
    void this.router.navigate(['audiences']);
  }
}
