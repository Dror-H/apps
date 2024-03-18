import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { In } from 'typeorm';
import { TargetingTemplate } from '../data/targeting-template.entity';
import { TargetingTemplateRepository } from '../data/targeting-template.repository';

@Injectable()
export class TargetingTemplateNestCrudService extends TypeOrmCrudService<TargetingTemplate> {
  constructor(@Inject(TargetingTemplateRepository) repo: TargetingTemplateRepository) {
    super(repo);
  }

  async deleteByIds(targetingIds: string[]): Promise<string[]> {
    await this.repo.delete({ id: In(targetingIds) });
    return targetingIds;
  }

  async deleteById(targetingId: string): Promise<string> {
    await this.repo.findOneOrFail(targetingId);
    await this.repo.delete(targetingId);
    return targetingId;
  }
}
