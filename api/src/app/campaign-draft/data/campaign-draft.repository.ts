import { CampaignDraft } from '@api/campaign-draft/data/campaign-draft.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CampaignDraft)
export class CampaignDraftRepository extends Repository<CampaignDraft> {}
