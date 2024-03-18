import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Post } from '../data/post.entity';
import { PostRepository } from '../data/post.repository';

@Injectable()
export class PostNestCrudService extends TypeOrmCrudService<Post> {
  constructor(@Inject(PostRepository) repo: PostRepository) {
    super(repo);
  }
}
