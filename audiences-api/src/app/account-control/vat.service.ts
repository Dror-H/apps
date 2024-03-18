import { Injectable } from '@nestjs/common';
import validateVat, { CountryCodes, ViesValidationResponse } from 'validate-vat-ts';

@Injectable()
export class VatService {
  validationAttempt(country: string, vatNumber: string): Promise<ViesValidationResponse> {
    return validateVat(CountryCodes[country], vatNumber);
  }
}
