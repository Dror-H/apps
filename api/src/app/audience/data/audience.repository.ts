import { EntityRepository, Repository } from 'typeorm';
import { Audience } from './audience.entity';

@EntityRepository(Audience)
export class AudienceRepository extends Repository<Audience> {}
