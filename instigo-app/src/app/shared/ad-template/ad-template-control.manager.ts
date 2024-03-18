import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HEADLINE_MAX_CHARS } from '@app/global/utils';
import {
  arrayUniqueItemValidator,
  atLeastOneValidator,
  nonExistingUrlValidator,
  urlRegex,
} from '@app/shared/shared/custom-form.validators';
import { AdTemplateSubtype, SupportedProviders } from '@instigo-app/data-transfer-object';
import { isArray } from 'lodash-es';
import { ValidatorApiService } from '@app/api/services/validator-api.service';

export const multivariateFields = {
  headline: 'Headlines',
  message: 'Ad Texts',
  linkDestination: 'Ad Links',
  linkCaption: 'Link Captions',
  linkDescription: 'Link Descriptions',
  callToAction: 'Call to Actions',
  picture: 'Image',
};

export const getFacebookAdTemplateFormValidators = (controlName: string): ValidatorFn[] => {
  switch (controlName) {
    case 'headline':
      return [Validators.required, Validators.maxLength(HEADLINE_MAX_CHARS)];
    case 'linkDestination':
      return [Validators.required, Validators.pattern(urlRegex)];
    case 'picture':
      return [Validators.required];
    case 'video':
      return [Validators.required];
    case 'thumbnail':
      return [Validators.required];
    case 'adFormat':
      return [Validators.required];
    case 'social':
      return [atLeastOneValidator];
    case 'pageInfo':
      return [Validators.required];
    case 'childAttachments':
      return [Validators.required, Validators.minLength(2)];
    case 'leadgenFormId':
      return [Validators.required];
    case 'eventId':
      return [Validators.required];
    default:
      return [];
  }
};

export const asyncValidators = (controlName: string, service: ValidatorApiService): AsyncValidatorFn[] => {
  switch (controlName) {
    case 'linkDestination':
      return [nonExistingUrlValidator(service)];
  }
};

export const getLinkedinAdTemplateFormValidators = (controlName: string): ValidatorFn[] => {
  switch (controlName) {
    case 'headline':
      return [Validators.required, Validators.maxLength(HEADLINE_MAX_CHARS)];
    case 'linkDestination':
      return [Validators.required, Validators.pattern(urlRegex)];
    default:
      return [];
  }
};

const getDisabledControls = {
  EVENT: ['headline', 'leadgenFormId', 'linkCaption', 'linkDescription', 'callToAction'],
  LEADGEN: ['eventId', 'linkDestination', 'linkCaption', 'linkDescription'],
};

export const isControlDisabled = (name: string, adTemplateSubtype: AdTemplateSubtype): boolean => {
  if (adTemplateSubtype != null) {
    return getDisabledControls[adTemplateSubtype].includes(name);
  }
  return ['eventId', 'leadgenFormId'].includes(name);
};

export const getADTemplateFormDefaultValue = (controlName: string) => {
  switch (controlName) {
    case 'callToAction':
      return 'NO_BUTTON';
    default:
      return null;
  }
};

export class AdTemplateFormBuilder {
  public readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private provider: SupportedProviders = SupportedProviders.FACEBOOK,
    private asyncValidatorService?: ValidatorApiService,
  ) {
    this.form = this.fb.group({});
  }

  public addControl(name: string, value: any, disabled = false): AdTemplateFormBuilder {
    this.form.addControl(
      name,
      this.fb.control(
        {
          value,
          disabled,
        },
        this.getProviderValidators(name),
        asyncValidators(name, this.asyncValidatorService),
      ),
    );
    return this;
  }

  public addGroup(name: string, value: { name: string; value: any }[]): AdTemplateFormBuilder {
    const newFormGroup = this.fb.group({}, { validators: this.getProviderValidators(name) });
    value.forEach((item) => {
      newFormGroup.addControl(item.name, this.fb.control(item.value, this.getProviderValidators(item.name)));
    });
    this.form.addControl(name, newFormGroup);
    return this;
  }

  public addArray(name: string, value: any[]): AdTemplateFormBuilder {
    this.form.addControl(
      name,
      this.fb.array(
        [
          ...this.createFormArray(
            value,
            this.getProviderValidators(name),
            asyncValidators(name, this.asyncValidatorService),
          ),
        ],
        [arrayUniqueItemValidator],
      ),
    );
    return this;
  }

  private createFormArray(
    array: any[],
    validators?: ValidatorFn[],
    asyncValidators?: AsyncValidatorFn[],
  ): FormControl[] {
    if (isArray(array) && array.length > 0) {
      return array.map((item) => this.fb.control(item, validators, asyncValidators));
    }
    return [this.fb.control(array, validators)];
  }

  private getProviderValidators(controlName: string): ValidatorFn[] {
    switch (this.provider) {
      case SupportedProviders.FACEBOOK:
        return getFacebookAdTemplateFormValidators(controlName);
      case SupportedProviders.LINKEDIN:
        return getLinkedinAdTemplateFormValidators(controlName);
    }
  }
}
