import { CampaignDraft } from '@api/campaign-draft/data/campaign-draft.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { In } from 'typeorm';
import { CampaignDraftRepository } from '../data/campaign-draft.repository';

@Injectable()
export class CampaignDraftNestCrudService extends TypeOrmCrudService<CampaignDraft> {
  constructor(@Inject(CampaignDraftRepository) repo: CampaignDraftRepository) {
    super(repo);
  }

  async deleteByIds(adTemplateIds: string[]) {
    return this.repo.delete({ id: In(adTemplateIds) });
  }
}
