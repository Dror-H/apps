import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isArray } from 'lodash-es';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  getADTemplateFormDefaultValue,
  getFacebookAdTemplateFormValidators,
} from '@app/shared/ad-template/ad-template-control.manager';
import { MAX_AD_VARIATIONS_NUMBER } from '@instigo-app/data-transfer-object';

@Injectable()
export class MultiVariateCreativesService {
  public canAddVariation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private fb: FormBuilder) {}

  public stop(): void {
    this.canAddVariation.next(false);
  }

  public goOn(): void {
    this.canAddVariation.next(true);
  }

  public getVariationsSize(controlName: string, containerForm: FormGroup): number {
    const options = containerForm.value;
    let max = 1;
    Object.keys(options).forEach((key) => {
      if (isArray(options[key])) {
        if (controlName === key) {
          max *= options[key].length + 1;
        } else {
          max *= options[key].length;
        }
      }
    });
    return max;
  }

  public getPossibleVariation(currentVariations: number): number {
    return Math.floor(MAX_AD_VARIATIONS_NUMBER / currentVariations);
  }

  public addControl(controlName: string, containerForm: FormGroup): number {
    const currentVariations = this.getVariationsSize(controlName, containerForm);
    if (currentVariations > MAX_AD_VARIATIONS_NUMBER) {
      this.stop();
      return 1;
    }
    this.goOn();

    const control = this.fb.control(
      getADTemplateFormDefaultValue(controlName),
      getFacebookAdTemplateFormValidators(controlName),
    );
    control.markAsDirty();
    (containerForm.get(controlName) as FormArray).push(control);
    return currentVariations;
  }
}
