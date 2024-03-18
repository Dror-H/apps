import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AdAccount } from '../data/ad-account.entity';
import { AdAccountRepository } from '../data/ad-account.repository';

@Injectable()
export class AdAccountNestCrudService extends TypeOrmCrudService<AdAccount> {
  constructor(@Inject(AdAccountRepository) repo: AdAccountRepository) {
    super(repo);
  }
}
