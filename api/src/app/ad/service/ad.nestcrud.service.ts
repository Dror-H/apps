import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Ad } from '../data/ad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdNestCrudService extends TypeOrmCrudService<Ad> {
  constructor(
    @InjectRepository(Ad)
    public repo: Repository<Ad>,
  ) {
    super(repo);
  }
}
