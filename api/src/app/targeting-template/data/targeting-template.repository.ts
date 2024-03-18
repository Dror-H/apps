import { EntityRepository, Repository } from 'typeorm';
import { TargetingTemplate } from './targeting-template.entity';

@EntityRepository(TargetingTemplate)
export class TargetingTemplateRepository extends Repository<TargetingTemplate> {}
