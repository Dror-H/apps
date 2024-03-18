import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { PostDTO, Resources } from '@instigo-app/data-transfer-object';
import { Crud, CrudController } from '@nestjsx/crud';
import { Post } from '../data/post.entity';
import { PostNestCrudService } from '../service/post.nestcrud.service';

@Crud({
  model: {
    type: PostDTO,
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
      adAccounts: {
        eager: true,
        allow: ['id'],
      },
      page: {
        eager: true,
        allow: ['providerId'],
      },
      'adAccount.workspace': {
        eager: true,
        select: false,
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.POSTS })
export class PostController implements CrudController<Post> {
  constructor(public service: PostNestCrudService) {}
}
