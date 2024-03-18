import { Component, Input } from '@angular/core';
import { MultiVariateCreativesService } from '@app/pages/new-campaign/services/multi-variate-creatives.service';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { MAX_AD_VARIATIONS_NUMBER } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-linkedin-image-multivariate',
  templateUrl: './linkedin-image-multivariate.component.html',
})
export class LinkedinImageMultivariateComponent {
  @Input() multivariateImageForm = new FormGroup({});
  public availableVariations = MAX_AD_VARIATIONS_NUMBER;

  constructor(private multiVariateService: MultiVariateCreativesService) {}

  public addControl(name: string): void {
    this.multiVariateService.addControl(name, this.multivariateImageForm);
  }

  public removeControl(formArray: AbstractControl, index: number): void {
    if (index > 0) {
      (formArray as FormArray).removeAt(index);
    }
  }
}
