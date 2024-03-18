import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadgenFormController } from './controller/leadgen-form.controller';
import { LeadgenFormRepository } from './data/leadgen_form.repository';
import { LeadgenFormNestCrudService } from './service/leadgen-form.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeadgenFormRepository])],
  providers: [LeadgenFormNestCrudService],
  controllers: [LeadgenFormController],
  exports: [TypeOrmModule],
})
export class LeadgenFormModule {}
