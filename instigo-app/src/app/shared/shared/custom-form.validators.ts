import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AdAccountDTO, BudgetType } from '@instigo-app/data-transfer-object';
import { compareAsc, differenceInCalendarDays, differenceInHours, setHours, setMinutes } from 'date-fns';
import { ValidatorApiService } from '@app/api/services/validator-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';

/* eslint-disable no-useless-escape */
export const urlRegex = /^(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
export const numberRegex = /\d/;
export const upperCaseRegex = /[A-Z]/;
export const lowerCaseRegex = /[a-z]/;

export function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }

    const valid = regex.test(control.value);

    return valid ? null : error;
  };
}

export function atLeastOneValidator(formGroup: FormGroup) {
  for (const key of Object.keys(formGroup.controls)) {
    if (formGroup.controls[key].value != null) {
      return null;
    }
  }
  return { atLeastOne: true };
}

export function requiredEachItemAndNoButtonValidator(formGroup: FormArray) {
  for (const control of formGroup.controls) {
    if (control.value === null || control.value === 'NO_BUTTON') {
      return { requiredEachItem: true };
    }
  }
  return null;
}

export function budgetValidator(formControl: FormGroup) {
  const optimizationGoalFormControl = formControl.get('delivery.optimizedFor');
  if (optimizationGoalFormControl.value) {
    const budgetSettingsFormControl = formControl.get('budget');
    const adAccount: AdAccountDTO = formControl.get('settings.account').value;
    return setValidatorForBudget(budgetSettingsFormControl, optimizationGoalFormControl, adAccount);
  }
  return null;
}

export function setValidatorForBudget(
  budgetSettingsFormControl: AbstractControl,
  optimizationGoalFormControl: AbstractControl,
  adAccount: AdAccountDTO,
) {
  const minBudget = adAccount ? getMinBudgetPerDayFor(adAccount, optimizationGoalFormControl?.value as string) : null;
  if (minBudget) {
    const budgetType = budgetSettingsFormControl.get('budgetType')?.value;
    const budgetFormControlValue = budgetSettingsFormControl.get(`budget`).value;

    switch (budgetType) {
      case 'daily': {
        if (minBudget > budgetFormControlValue) {
          return { minBudget: minBudget.toFixed(2) };
        }
        break;
      }
      case 'lifetime': {
        const startDate = budgetSettingsFormControl.get('range.startDate')?.value;
        const endDate = budgetSettingsFormControl.get('range.endDate')?.value;
        const diffTimeInDays =
          startDate && endDate ? differenceInCalendarDays(new Date(endDate), new Date(startDate)) : 1;

        if (minBudget * diffTimeInDays > budgetFormControlValue) {
          const result = minBudget * diffTimeInDays;
          return { minBudget: result.toFixed(2) };
        }
        break;
      }
    }
  }
  return null;
}

//* is the optimizationGoal relevant?
export function getMinBudgetPerDayFor(adAccount: AdAccountDTO, optimizationGoal: string): number {
  const minBudgets = {
    IMPRESSIONS: (adAccount.minDailyBudget?.minDailyBudgetImp ?? 110) / 100,
    DEFAULT: (adAccount.minDailyBudget?.minDailyBudgetImp ?? 110) / 100,
  };
  return minBudgets[optimizationGoal] || minBudgets.DEFAULT;
}

export function rangeValidator(formControl: FormGroup) {
  let startDate = formControl.get('range.startDate').value;
  let endDate = formControl.get('range.endDate').value;
  let startTime = formControl.get('range.startTime').value?.split(':');
  let endTime = formControl.get('range.endTime').value?.split(':');
  const budgetType = formControl.get('budgetType').value;

  if (budgetType === BudgetType.DAILY && !endDate && !endTime) {
    return null;
  }
  if (budgetType === BudgetType.LIFETIME && !endDate && !endTime) {
    return { range: true };
  }
  if (!endTime) {
    endTime = ['00', '00'];
  }
  if (!startTime) {
    startTime = ['00', '00'];
  }
  startDate = setHours(startDate, startTime[0]);
  endDate = setHours(endDate, endTime[0]);
  startDate = setMinutes(startDate, startTime[1]);
  endDate = setMinutes(endDate, endTime[1]);

  if (compareAsc(startDate, endDate) !== -1 && budgetType === BudgetType.LIFETIME) {
    return { range: true };
  }
  const diffOfStartDateInHours = differenceInHours(endDate, startDate);

  if (diffOfStartDateInHours < 24) {
    return { rangeMin: { minH: 24 } };
  }
  return null;
}

export function arrayUniqueItemValidator(formArray: FormArray) {
  const controls = formArray.controls;
  for (let i = 0; i < controls.length - 1; i++) {
    for (let j = i + 1; j < controls.length; j++) {
      if (controls[i].value === controls[j].value) {
        return { unique: true };
      }
    }
  }
  return null;
}

export function lookalikeAudienceValidator(formControl: FormControl) {
  const { list, reaches } = formControl.value || {};
  if (!list || !reaches) {
    return { listOrReachesNotReceived: true };
  }
  if (list.length === 0 && (reaches.length === 0 || reaches[0] === 0)) {
    return { lookalike: true };
  }
  if (list.length === 0) {
    return { lookalikeList: true };
  }
  if (Object.keys(list[0].originAudience).length === 0) {
    return { lookalikeList: true };
  }
  if (reaches.reaches === 0 || reaches[0] === 0) {
    return { lookalikeReaches: true };
  }
  return null;
}

export function fromAgeHigherThanToAgeValidator(formControl: FormControl) {
  const formValue = formControl.value;

  if (!formValue) {
    return null;
  }

  if (formValue.fromAge > formValue.toAge) {
    return { higherThanToAge: true };
  }

  return null;
}

export function nonExistingUrlValidator(validatorApiService: ValidatorApiService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> =>
    validatorApiService
      .isValidUrl(control.value)
      .pipe(map((result: boolean) => (result ? null : { nonExistingUrl: true })));
}

export function customerFilesValidator(formGroup: FormGroup): null | { noCustomerFileSources: boolean } {
  const usersChecked = formGroup.get('users').value;
  const partnersChecked = formGroup.get('partners').value;

  if (!usersChecked && !partnersChecked) {
    return { noCustomerFileSources: true };
  }

  return null;
}

export function customerFilesSelectedValidator(control: FormControl): null | { noCustomerFileSources: boolean } {
  if (!control.value) {
    return null;
  }

  if (!control.value.customerFileSources) {
    return { noCustomerFileSources: true };
  }

  return null;
}

export function customStripeCardValidator(control: FormControl): null | { invalidCard: string } {
  if (!control.value) {
    return null;
  }

  const { empty, error } = (control.value as StripeCardElementChangeEvent) || {};

  if (error) {
    return { invalidCard: error.message };
  }

  if (empty) {
    return { invalidCard: 'Card number is required' };
  }

  return null;
}
