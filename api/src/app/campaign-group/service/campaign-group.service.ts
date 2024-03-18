import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CampaignGroup } from '../data/campaign-group.entity';
import { CampaignGroupRepository } from '../data/campaign-group.repository';

@Injectable()
export class CampaignGroupNestCrudService extends TypeOrmCrudService<CampaignGroup> {
  constructor(@Inject(CampaignGroupRepository) public repo: CampaignGroupRepository) {
    super(repo);
  }
}
