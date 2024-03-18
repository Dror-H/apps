import { Module } from '@nestjs/common';
import { ValidationController } from '@api/validation/controllers/validation.controller';
import { ValidationService } from '@api/validation/service/validation.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ValidationController],
  imports: [HttpModule],
  providers: [ValidationService],
})
export class ValidationModule {}
