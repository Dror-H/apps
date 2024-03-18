import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { EventsDTO, Resources } from '@instigo-app/data-transfer-object';
import { Crud, CrudController } from '@nestjsx/crud';
import { EventsEntity } from '../data/events.entity';
import { EventsNestCrudService } from '../service/events.nescrud.service';

@Crud({
  model: {
    type: EventsDTO,
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
  query: {
    join: {
      page: {
        eager: true,
        allow: ['providerId, name'],
      },
      'page.adaccounts': {
        eager: true,
        select: false,
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.EVENTS })
export class EventsController implements CrudController<EventsEntity> {
  constructor(public service: EventsNestCrudService) {}
}
