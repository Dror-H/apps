import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AdSet } from '../data/ad-set.entity';
import { AdSetRepository } from '../data/ad-set.repository';

@Injectable()
export class AdSetNestCrudService extends TypeOrmCrudService<AdSet> {
  constructor(@Inject(AdSetRepository) repo: AdSetRepository) {
    super(repo);
  }
}
