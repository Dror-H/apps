import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { In } from 'typeorm';
import { AdTemplate } from '../data/ad-template.entity';
import { AdTemplateRepository } from '../data/ad-template.repository';

@Injectable()
export class AdTemplateNestCrudService extends TypeOrmCrudService<AdTemplate> {
  constructor(@Inject(AdTemplateRepository) repo) {
    super(repo);
  }

  async deleteById(adTemplateId: string) {
    return this.repo.delete({ id: adTemplateId });
  }

  async deleteByIds(adTemplateIds: string[]) {
    return this.repo.delete({ id: In(adTemplateIds) });
  }
}
