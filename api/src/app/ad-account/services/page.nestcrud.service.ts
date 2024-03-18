import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Page } from '../data/page.entity';
import { PageRepository } from '../data/page.repository';

@Injectable()
export class PageNestCrudService extends TypeOrmCrudService<Page> {
  constructor(@Inject(PageRepository) repo: PageRepository) {
    super(repo);
  }
}
