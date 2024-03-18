import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LeadgenForm } from '../data/leadgen-form.entity';
import { LeadgenFormRepository } from '../data/leadgen_form.repository';

@Injectable()
export class LeadgenFormNestCrudService extends TypeOrmCrudService<LeadgenForm> {
  constructor(@Inject(LeadgenFormRepository) public repo: LeadgenFormRepository) {
    super(repo);
  }
}
