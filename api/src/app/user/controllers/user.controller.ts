import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Resources } from '@instigo-app/data-transfer-object';
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from '../data/user.entity';
import { UserNestCrudService } from '../services/user.nestcrud.service';

@Crud({
  model: {
    type: User,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    exclude: ['password'],
    join: {
      oAuthTokens: {
        eager: true,
        allow: ['id', 'provider', 'providerClientId', 'scope', 'createdAt', 'updatedAt', 'expiresAt', 'grantedAt'],
      },
      ownedWorkspace: {
        eager: true,
      },
      assignedWorkspaces: {
        eager: true,
      },
      assignedTeams: {
        eager: true,
      },
      subscription: {
        eager: true,
        exclude: ['source'],
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.USERS })
export class UserController implements CrudController<User> {
  constructor(public service: UserNestCrudService) {}
}
