import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VatService } from './vat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ViesValidationResponse } from 'validate-vat-ts';

@Controller('vat-check')
@UseGuards(AuthGuard('jwt'), ApiBearerAuth)
@ApiTags('vat-check')
export class VatController {
  constructor(private vatService: VatService) {}

  @Get(':country/:vat')
  validateVatNumber(@Param('country') country: string, @Param('vat') vat: string): Promise<ViesValidationResponse> {
    return this.vatService.validationAttempt(country, vat);
  }
}
