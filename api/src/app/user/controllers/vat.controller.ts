import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VatService } from '../services/vat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('vat-check')
@UseGuards(AuthGuard('jwt'), ApiBearerAuth)
@ApiTags('vat-check')
export class VatController {
  constructor(private vatService: VatService) {}

  @Get(':country/:vat')
  validateVatNumber(@Param('country') country, @Param('vat') vat) {
    return this.vatService.validationAttempt(country, vat);
  }
}
