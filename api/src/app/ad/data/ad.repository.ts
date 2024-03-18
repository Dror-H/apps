import { EntityRepository, Repository } from 'typeorm';
import { Ad } from './ad.entity';

@EntityRepository(Ad)
export class AdRepository extends Repository<Ad> {}
