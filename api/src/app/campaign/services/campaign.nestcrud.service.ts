import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Campaign } from '../data/campaign.entity';
import { CampaignRepository } from '../data/campaign.repository';

@Injectable()
export class CampaignNestCrudService extends TypeOrmCrudService<Campaign> {
  constructor(@Inject(CampaignRepository) repo: CampaignRepository) {
    super(repo);
  }
}
