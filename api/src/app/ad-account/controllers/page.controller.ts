import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { PageDTO, Resources } from '@instigo-app/data-transfer-object';
import { Crud, CrudController } from '@nestjsx/crud';
import { Page } from '../data/page.entity';
import { PageNestCrudService } from '../services/page.nestcrud.service';

@Crud({
  model: {
    type: PageDTO,
  },
  routes: {
    exclude: [],
  },
  params: {
    id: {
      field: 'providerId',
      type: 'string',
      primary: true,
    },
  },
})
@CompositionDecorator({ resource: Resources.PAGE })
export class PageController implements CrudController<Page> {
  constructor(public service: PageNestCrudService) {}
}
