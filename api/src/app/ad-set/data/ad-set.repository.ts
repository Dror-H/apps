import { EntityRepository, Repository } from 'typeorm';
import { AdSet } from './ad-set.entity';

@EntityRepository(AdSet)
export class AdSetRepository extends Repository<AdSet> {}
