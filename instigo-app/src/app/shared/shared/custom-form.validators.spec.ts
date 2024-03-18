import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ValidatorApiService } from '@app/api/services/validator-api.service';
import { AdAccountDTO, BudgetType, CustomerFileSources } from '@instigo-app/data-transfer-object';
import { of } from 'rxjs';
import {
  arrayUniqueItemValidator,
  atLeastOneValidator,
  budgetValidator,
  customerFilesSelectedValidator,
  customerFilesValidator,
  customStripeCardValidator,
  fromAgeHigherThanToAgeValidator,
  getMinBudgetPerDayFor,
  lookalikeAudienceValidator,
  nonExistingUrlValidator,
  numberRegex,
  patternValidator,
  rangeValidator,
  requiredEachItemAndNoButtonValidator,
  setValidatorForBudget,
} from './custom-form.validators';

const mockValidatorApiService = {
  isValidUrl(url: string) {
    return of(false);
  },
} as ValidatorApiService;

describe('Custom form validators', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
  });

  describe('patternValidator', () => {
    beforeEach(() => {
      control.setValidators(patternValidator(numberRegex, { isNumber: true }));
    });

    it('should return null if value is falsy', () => {
      control.setValue('');

      expect(control.hasError('isNumber')).toBeFalsy();
    });
    it('should be valid if given correct input', () => {
      control.setValue('1234');

      expect(control.hasError('isNumber')).toBeFalsy();
      expect(control.valid).toBeTruthy();
    });

    it('should return error object from input if value does not match regex', () => {
      control.setValue('test');

      expect(control.hasError('isNumber')).toBeTruthy();
    });
  });

  describe('atLeastOneValidator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormGroup(
        {
          control1: new FormControl(null),
          control2: new FormControl(null),
        },
        [atLeastOneValidator],
      );
    });

    it('should return "atLeastOne" error if at least one control is not null', () => {
      expect(formGroup.hasError('atLeastOne')).toBeTruthy();
    });

    it('should return null if one control has value', () => {
      formGroup.get('control1').setValue('test');

      expect(formGroup.hasError('atLeastOne')).toBeFalsy();
    });
  });

  describe('requiredEachItemAndNoButtonValidator', () => {
    let formArray: FormArray;

    beforeEach(() => {
      formArray = new FormArray([new FormControl(), new FormControl()], [requiredEachItemAndNoButtonValidator]);
    });

    it('should return { requiredEachItem: true } if one or more controls null', () => {
      formArray.controls[0].setValue(null);
      formArray.controls[0].setValue('test');

      expect(formArray.hasError('requiredEachItem')).toBeTruthy();
    });

    it("should return { requiredEachItem: true } if one or more control's value is 'NO_BUTTON' ", () => {
      formArray.controls[0].setValue('NO_BUTTON');
      formArray.controls[1].setValue('test');

      expect(formArray.hasError('requiredEachItem')).toBeTruthy();
    });

    it("should return null if all controls don't have null or 'NO_BUTTON' as value", () => {
      formArray.controls[0].setValue('test');
      formArray.controls[1].setValue('test');

      expect(formArray.valid).toBeTruthy();
    });
  });

  describe('budgetValidator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormGroup(
        {
          delivery: new FormGroup({
            optimizedFor: new FormControl(),
          }),
          budget: new FormGroup({
            budgetType: new FormControl(),
            budget: new FormControl(),
          }),
          settings: new FormGroup({
            account: new FormGroup({
              minDailyBudget: new FormGroup({
                minDailyBudgetImp: new FormControl(),
              }),
            }),
          }),
        },
        [budgetValidator],
      );
    });

    it('should return null if optimizedFor is falsy', () => {
      expect(formGroup.valid).toBeTruthy();
    });

    it("should error with { minBudget: '1.00' } if optimizedFor is truthy and calculations result over budget", () => {
      formGroup.get('delivery.optimizedFor').setValue('IMPRESSIONS');
      formGroup.get('budget.budgetType').setValue('lifetime');
      formGroup.get('budget.budget').setValue(0);
      formGroup.get('settings.account.minDailyBudget.minDailyBudgetImp').setValue(100);

      expect(formGroup.invalid).toBeTruthy();
      expect(formGroup.errors).toEqual({ minBudget: '1.00' });
    });

    it('should be valid if optimizedFor is truthy and calculations result under budget', () => {
      formGroup.get('delivery.optimizedFor').setValue('IMPRESSIONS');
      formGroup.get('budget.budgetType').setValue('lifetime');
      formGroup.get('budget.budget').setValue(100);
      formGroup.get('settings.account.minDailyBudget.minDailyBudgetImp').setValue(0);

      expect(formGroup.valid).toBeTruthy();
    });

    describe('getMinBudgetPerDayFor', () => {
      it('should return 1.1 on no minDailyBudget obj or/and no optimizationGoal', () => {
        const impressionsResult = getMinBudgetPerDayFor({} as AdAccountDTO, 'IMPRESSIONS');
        const defaultResult = getMinBudgetPerDayFor({} as AdAccountDTO, '');

        expect(impressionsResult).toBe(1.1);
        expect(defaultResult).toBe(1.1);
      });

      it('should return 0.01 if minDailyBudgetImp is 1', () => {
        const impressionsResult = getMinBudgetPerDayFor(
          { minDailyBudget: { minDailyBudgetImp: 1 } } as AdAccountDTO,
          'IMPRESSIONS',
        );
        const defaultResult = getMinBudgetPerDayFor({ minDailyBudget: { minDailyBudgetImp: 1 } } as AdAccountDTO, '');

        expect(impressionsResult).toBe(0.01);
        expect(defaultResult).toBe(0.01);
      });
    });

    describe('setValidatorForBudget', () => {
      it('should return null if no adAccount is provided', () => {
        const result = setValidatorForBudget({} as FormControl, {} as FormControl, null as AdAccountDTO);
        expect(result).toBeNull();
      });

      it('should return null if budget type is not daily or lifetime', () => {
        const budgetSettingsFormControl = new FormGroup({
          budget: new FormControl(0),
          budgetType: new FormControl('test'),
        });

        const result = setValidatorForBudget(budgetSettingsFormControl, {} as FormControl, {} as AdAccountDTO);

        expect(result).toBeNull();
      });

      it("should return { minBudget: '1.00' } if minBudget > budgetFormControlValue", () => {
        const budgetSettingsFormControl = new FormGroup({
          budget: new FormControl(0),
          budgetType: new FormControl('daily'),
        });
        const optimizationFormControl = new FormControl();
        const adAccountMock = {
          minDailyBudget: { minDailyBudgetImp: 100 },
        } as AdAccountDTO;

        const result = setValidatorForBudget(budgetSettingsFormControl, optimizationFormControl, adAccountMock);

        expect(result).toEqual({ minBudget: '1.00' });
      });

      it("should return { minBudget: '1.80' } if (minBudget * diffTimeInDays > budgetFormControlValue)", () => {
        const budgetSettingsFormControl = new FormGroup({
          budget: new FormControl(0),
          budgetType: new FormControl('lifetime'),
          range: new FormGroup({
            startDate: new FormControl('2.2.2000'),
            endDate: new FormControl('2.20.2000'),
          }),
        });
        const optimizationFormControl = new FormControl();
        const adAccountMock = {
          minDailyBudget: { minDailyBudgetImp: 10 },
        } as AdAccountDTO;

        const result = setValidatorForBudget(budgetSettingsFormControl, optimizationFormControl, adAccountMock);

        expect(result).toEqual({ minBudget: '1.80' });
      });
    });
  });

  describe('rangeValidator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormGroup(
        {
          range: new FormGroup({
            startDate: new FormControl(null),
            endDate: new FormControl(null),
            startTime: new FormControl(null),
            endTime: new FormControl(null),
          }),
          budgetType: new FormControl(null),
        },
        [rangeValidator],
      );
    });

    it('should return null if budgetType === BudgetType.DAILY && !endDate && !endTime', () => {
      formGroup.get('budgetType').setValue(BudgetType.DAILY);

      expect(formGroup.valid).toBeTruthy();
    });

    it('should return { range: true } if budgetType === BudgetType.LIFETIME && !endDate && !endTime', () => {
      formGroup.get('budgetType').setValue(BudgetType.LIFETIME);

      expect(formGroup.hasError('range')).toBeTruthy();
    });

    it('should return { range: true } if compareAsc(startDate, endDate) !== -1 && budgetType === BudgetType.LIFETIME', () => {
      formGroup.get('budgetType').setValue(BudgetType.LIFETIME);
      formGroup.get('range.startDate').setValue(new Date('3.2.2000'));
      formGroup.get('range.endDate').setValue(new Date('2.2.2000'));

      expect(formGroup.hasError('range')).toBeTruthy();
    });
    it('should return  { rangeMin: { minH: 24 } } start date and end date have more than 24h difference', () => {
      formGroup.get('range.startDate').setValue(new Date('4.2.2000'));
      formGroup.get('range.endDate').setValue(new Date('2.2.2000'));

      expect(formGroup.hasError('rangeMin')).toBeTruthy();
    });
  });

  describe('arrayUniqueItemValidator', () => {
    let formArray: FormArray;

    beforeEach(() => {
      formArray = new FormArray([new FormControl(), new FormControl()], [arrayUniqueItemValidator]);
    });

    it('should return null if control values are not unique', () => {
      formArray.controls[0].setValue('test 1');
      formArray.controls[1].setValue('test 2');

      expect(formArray.valid).toBeTruthy();
    });

    it('should return { unique: true } if control values are unique', () => {
      formArray.controls[0].setValue('same value');
      formArray.controls[1].setValue('same value');

      expect(formArray.hasError('unique')).toBeTruthy();
    });
  });

  describe('lookalikeAudienceValidator', () => {
    beforeEach(() => {
      control.setValidators(lookalikeAudienceValidator);
      control.updateValueAndValidity();
    });
    it('should return { listOrReachesNotReceived: true } if list or reach or both are not present', () => {
      expect(control.hasError('listOrReachesNotReceived')).toBeTruthy();

      control.setValue({ list: [] });

      expect(control.hasError('listOrReachesNotReceived')).toBeTruthy();

      control.setValue({ reaches: [] });

      expect(control.hasError('listOrReachesNotReceived')).toBeTruthy();
    });

    it('should return { lookalike: true } if list and reaches have no length', () => {
      control.setValue({ list: [], reaches: [] });

      expect(control.hasError('lookalike')).toBeTruthy();
    });

    it('should return { lookalike: true } if list has no length and reaches[0] === 0', () => {
      control.setValue({ list: [], reaches: [0] });

      expect(control.hasError('lookalike')).toBeTruthy();
    });

    it('should return { lookalikeList: true } if list has no length', () => {
      control.setValue({ list: [], reaches: [1, 2, 4] });

      expect(control.hasError('lookalikeList')).toBeTruthy();
    });

    it('should return { lookalikeList: true } if Object.keys(list[0].originAudience).length === 0', () => {
      control.setValue({ list: [{ originAudience: [] }], reaches: [1, 2, 3] });

      expect(control.hasError('lookalikeList')).toBeTruthy();
    });

    it('should return { lookalikeReaches: true } if reaches.reaches === 0 || reaches[0] === 0', () => {
      control.setValue({ list: [{ originAudience: { test: true } }], reaches: { reaches: 0 } });

      expect(control.hasError('lookalikeReaches')).toBeTruthy();

      control.setValue({ list: [{ originAudience: { test: true } }], reaches: [0] });

      expect(control.hasError('lookalikeReaches')).toBeTruthy();
    });

    it('should return null if list and reaches are correctly set', () => {
      control.setValue({ list: [{ originAudience: { test: true } }], reaches: { reaches: 1 } });

      expect(control.valid).toBeTruthy();

      control.setValue({ list: [{ originAudience: { test: true } }], reaches: [1] });

      expect(control.valid).toBeTruthy();
    });
  });

  describe('fromAgeHigherThanToAgeValidator', () => {
    beforeEach(() => {
      control.setValidators(fromAgeHigherThanToAgeValidator);
      control.updateValueAndValidity();
    });
    it('should return higherThanToAge error if control value obj field fromAge > toAge', () => {
      control.setValue({ fromAge: 2, toAge: 1 });

      expect(control.hasError('higherThanToAge')).toBeTruthy();
    });

    it('should be valid if control value obj field fromAge < toAge', () => {
      control.setValue({ fromAge: 1, toAge: 2 });

      expect(control.errors).toBeNull();
      expect(control.valid).toBeTruthy();
    });
  });

  describe('nonExistingUrlValidator', () => {
    beforeEach(() => {
      control.setAsyncValidators(nonExistingUrlValidator(mockValidatorApiService));
    });

    it('should return error nonExistingUrl', () => {
      control.setValue('test');
      expect(control.hasError('nonExistingUrl')).toBeTruthy();
    });

    it('should call validator api service isValidUrl method', () => {
      const validatorApiServiceSpy = jest.spyOn(mockValidatorApiService, 'isValidUrl');

      control.setValue('test');

      expect(validatorApiServiceSpy).toBeCalledWith(control.value);
    });
  });
  describe('customerFilesValidator', () => {
    const customerFilesForm = new FormGroup(
      {
        users: new FormControl(),
        partners: new FormControl(),
      },
      [customerFilesValidator],
    );
    it('should error if no value is selected', () => {
      expect(customerFilesForm.hasError('noCustomerFileSources')).toBeTruthy();
    });

    it('should not error if one control has truthy value', () => {
      customerFilesForm.get('users').setValue(true);

      expect(customerFilesForm.hasError('noCustomerFileSources')).toBeFalsy();
    });
  });

  describe('customerFilesSelectedValidator', () => {
    beforeEach(() => {
      control.setValidators([customerFilesSelectedValidator]);
      control.updateValueAndValidity();
    });
    it('should be valid if control has falsy value', () => {
      control.setValue(null);

      expect(control.valid).toBeTruthy();
    });

    it('should return error if value of control does not have customerFileSources field truthy', () => {
      control.setValue({ customerFileSources: null });

      expect(control.hasError('noCustomerFileSources')).toBeTruthy();
    });

    it('should be valid if control has obj with noCustomerFileSources field truthy', () => {
      control.setValue({ customerFileSources: CustomerFileSources.PARTNER_PROVIDED_ONLY });
    });
  });

  describe('customStripeCardValidator', () => {
    beforeEach(() => {
      control.setValidators(customStripeCardValidator);
      control.updateValueAndValidity();
    });
    it('should be valid if control value has no error and field empty is false', () => {
      control.setValue({ empty: false, error: undefined });

      expect(control.valid).toBeTruthy();
    });

    it('should return invalidCard error with custom message if control value has error field truthy', () => {
      control.setValue({ empty: true, error: undefined });

      expect(control.hasError('invalidCard')).toBeTruthy();
      expect(control.errors.invalidCard).toBe('Card number is required');
    });

    it('should return error message from field error in control value', () => {
      const TEST_ERR_MSG = 'testing error message';
      control.setValue({ empty: true, error: { message: TEST_ERR_MSG } });

      expect(control.hasError('invalidCard')).toBeTruthy();
      expect(control.errors.invalidCard).toBe(TEST_ERR_MSG);
    });
  });
});
