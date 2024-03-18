import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdTemplateFormBuilder } from '@app/shared/ad-template/ad-template-control.manager';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { ValidatorApiService } from '@app/api/services/validator-api.service';

@Injectable()
export class LinkedinAdTemplateGeneratorService {
  constructor(private fb: FormBuilder, private asyncValidatorService: ValidatorApiService) {}

  public generateMultiVariateImage(): FormGroup {
    return new AdTemplateFormBuilder(this.fb, SupportedProviders.LINKEDIN, this.asyncValidatorService)
      .addArray('headline', [null])
      .addArray('message', [null])
      .addArray('linkDestination', [null])
      .addArray('callToAction', ['NO_BUTTON'])
      .addControl('picture', null).form;
  }
}
