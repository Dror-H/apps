import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controller/post.controller';
import { PostRepository } from './data/post.repository';
import { PostNestCrudService } from './service/post.nestcrud.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  providers: [PostNestCrudService],
  controllers: [PostController],
  exports: [TypeOrmModule, PostNestCrudService],
})
export class PostModule {}
