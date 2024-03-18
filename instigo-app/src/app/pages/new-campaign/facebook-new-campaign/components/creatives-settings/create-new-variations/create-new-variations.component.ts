import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { campaignAdTemplateTypes, enableOrDisableMultivariateFields } from '@app/global/utils';
import { AdTemplateType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'ingo-create-new-variations',
  templateUrl: './create-new-variations.component.html',
})
export class CreateNewVariationsComponent implements OnInit {
  @Input() multivariate = new FormGroup({});
  public adTemplateTypes = cloneDeep(campaignAdTemplateTypes);
  public adType = AdTemplateType;
  public isContinueUnavailable = true;
  public supportedProviders = SupportedProviders;
  public selectedCampaignObjective: string;

  private get campaignObjectiveValue(): string {
    return this.multivariate.parent.parent.get('settings.objective')?.value;
  }

  ngOnInit() {
    this.setDefaultAsImage();
    this.restrictAdTemplateTypeAccordingToObjectives();
    this.selectedCampaignObjective = this.campaignObjectiveValue;
  }

  public setActiveType(adType: AdTemplateType) {
    enableOrDisableMultivariateFields(this.multivariate, adType, this.selectedCampaignObjective);
    this.multivariate.get('adTemplateType').setValue(adType);
  }

  private setDefaultAsImage() {
    const adTemplateType = this.multivariate.get('adTemplateType');
    if (adTemplateType.value == null) {
      adTemplateType.setValue(AdTemplateType.IMAGE);
    }
  }

  private restrictAdTemplateTypeAccordingToObjectives(): void {
    if (this.campaignObjectiveValue === 'VIDEO_VIEWS') {
      this.adTemplateTypes.forEach((adTemplateType: any) => {
        if (adTemplateType.value !== AdTemplateType.VIDEO) {
          adTemplateType.active = false;
        }
      });
    }
    if (
      this.campaignObjectiveValue === 'LEAD_GENERATION' ||
      this.campaignObjectiveValue === 'EVENT_RESPONSES' ||
      this.campaignObjectiveValue === 'PAGE_LIKES'
    ) {
      this.adTemplateTypes.forEach((adTemplateType: any) => {
        if (adTemplateType.value === AdTemplateType.CAROUSEL) {
          adTemplateType.active = false;
        }
      });
    }
  }
}
