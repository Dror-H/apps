import { Injectable } from '@nestjs/common';
import validateVat, { CountryCodes } from 'validate-vat-ts';

@Injectable()
export class VatService {
  validationAttempt(country, vatNumber) {
    return validateVat(CountryCodes[country], vatNumber);
  }
}
