import { EntityRepository, Repository } from 'typeorm';
import { CampaignGroup } from './campaign-group.entity';

@EntityRepository(CampaignGroup)
export class CampaignGroupRepository extends Repository<CampaignGroup> {}
