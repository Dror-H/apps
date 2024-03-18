import { EntityRepository, Repository } from 'typeorm';
import { AdTemplate } from './ad-template.entity';

@EntityRepository(AdTemplate)
export class AdTemplateRepository extends Repository<AdTemplate> {}
