import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from '../data/user.entity';
import { UserRepository } from '../data/user.repository';

@Injectable()
export class UserNestCrudService extends TypeOrmCrudService<User> {
  constructor(@Inject(UserRepository) userRepository: UserRepository) {
    super(userRepository);
  }
}
