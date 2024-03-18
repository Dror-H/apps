import { CampaignDraft } from '@api/campaign-draft/data/campaign-draft.entity';
import { CampaignDraftNestCrudService } from '@api/campaign-draft/services/campaign-draft.nestcrud.service';
import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { MissingParameterException } from '@instigo-app/api-shared';
import { Actions, CampaignDraftDTO, Resources } from '@instigo-app/data-transfer-object';
import { Delete, Query, ValidationPipe } from '@nestjs/common';
import { Action, Crud, CrudController } from '@nestjsx/crud';
import { CampaignDraftIdsFilter } from '../data/campaign-draft-ids';

@Crud({
  model: {
    type: CampaignDraftDTO,
  },
  routes: {
    exclude: [],
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      adAccount: {
        eager: true,
        alias: 'adAccount',
        allow: ['id'],
      },
      'adAccount.workspace': {
        eager: true,
        alias: 'adAccountWorkspace',
        allow: ['id'],
        select: false,
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.CAMPAIGN_DRAFTS })
export class CampaignDraftController implements CrudController<CampaignDraft> {
  constructor(public service: CampaignDraftNestCrudService) {}

  @Action(Actions.DeleteAll)
  @Delete()
  async deleteCampaignDrafts(
    @Query(new ValidationPipe({ transform: true })) filter: CampaignDraftIdsFilter,
  ): Promise<string[]> {
    if (!filter.campaignDraftIds || !filter.campaignDraftIds.length) {
      throw new MissingParameterException({ parameter: 'campaign draft id list' });
    }
    await this.service.deleteByIds(filter.campaignDraftIds);
    return filter.campaignDraftIds;
  }
}
