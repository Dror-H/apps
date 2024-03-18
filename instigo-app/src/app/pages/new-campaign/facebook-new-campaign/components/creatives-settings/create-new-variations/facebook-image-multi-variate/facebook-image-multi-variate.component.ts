import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { handleCampaignObjective } from '@app/global/utils';
import { MAX_AD_VARIATIONS_NUMBER, SupportedProviders } from '@instigo-app/data-transfer-object';
import { MultiVariateCreativesService } from '../../../../../services/multi-variate-creatives.service';

@Component({
  selector: 'ingo-facebook-image-multi-variate',
  templateUrl: './facebook-image-multi-variate.component.html',
  styleUrls: ['./facebook-image-multi-variate.component.scss'],
})
export class FacebookImageMultiVariateComponent implements OnInit {
  @Input() multivariateImageForm = new FormGroup({});
  @Input() campaignObjective: string = null;
  public provider = SupportedProviders.FACEBOOK;
  public adAccountId: string;
  public adAccountProviderId: string;
  public availableVariations = MAX_AD_VARIATIONS_NUMBER;

  constructor(private multiVariateService: MultiVariateCreativesService) {}

  public get adAccountForm(): FormControl {
    return this.multivariateImageForm.parent.parent.parent.get('settings.account') as FormControl;
  }

  public addControl(name: string): void {
    const currentVariations = this.multiVariateService.addControl(name, this.multivariateImageForm);
    this.availableVariations = this.multiVariateService.getPossibleVariation(currentVariations);
  }

  public removeControl(formArray: AbstractControl, index: number): void {
    if (index > 0) {
      (formArray as FormArray).removeAt(index);
      this.availableVariations--;
    }
  }

  ngOnInit(): void {
    this.adAccountId = this.adAccountForm.value.id;
    this.adAccountProviderId = this.adAccountForm.value.providerId;
    handleCampaignObjective(this.campaignObjective, this.multivariateImageForm);
  }
}
