import { EntityRepository, Repository } from 'typeorm';
import { LeadgenForm } from './leadgen-form.entity';

@EntityRepository(LeadgenForm)
export class LeadgenFormRepository extends Repository<LeadgenForm> {}
