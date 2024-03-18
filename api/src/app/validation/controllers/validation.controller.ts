import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ValidationService } from '../service/validation.service';

@Controller('Validation')
export class ValidationController {
  @Inject()
  private readonly validationService: ValidationService;

  @Post('url/')
  isUrlValid(@Body() { url }): Promise<boolean> {
    return this.validationService.pingUrl(url);
  }
}
