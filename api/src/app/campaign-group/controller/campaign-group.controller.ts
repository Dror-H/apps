import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CampaignGroupDTO, Resources } from '@instigo-app/data-transfer-object';
import { Crud, CrudController } from '@nestjsx/crud';
import { CampaignGroup } from '../data/campaign-group.entity';
import { CampaignGroupNestCrudService } from '../service/campaign-group.service';

@Crud({
  model: {
    type: CampaignGroupDTO,
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
        allow: ['id', 'name'],
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.CAMPAIGN_GROUP })
export class CampaignGroupController implements CrudController<CampaignGroup> {
  constructor(public service: CampaignGroupNestCrudService) {}
}
