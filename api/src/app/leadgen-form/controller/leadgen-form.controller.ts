import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Actions, LeadgenFormDTO, Resources } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { LeadgenForm } from '../data/leadgen-form.entity';
import { LeadgenFormNestCrudService } from '../service/leadgen-form.service';

@Crud({
  model: {
    type: LeadgenFormDTO,
  },
  routes: {
    exclude: [],
  },
  query: {
    join: {
      page: {
        eager: true,
        allow: ['provider_id', 'name'],
      },
      'page.adaccounts': {
        eager: true,
        select: false,
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.LEADGEN_FORM })
export class LeadgenFormController implements CrudController<LeadgenForm> {
  constructor(public service: LeadgenFormNestCrudService) {}

  @Action(Actions.CreateOne)
  @Override('createOneBase')
  async createLeadgenForm(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody()
    payload: LeadgenFormDTO,
  ): Promise<LeadgenFormDTO> {
    return await this.service.repo.save(payload);
  }
}
