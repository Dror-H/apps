import { Injectable, PipeTransform } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { User } from '@api/user/data/user.entity';
import { Resources } from '@instigo-app/data-transfer-object';

@Injectable()
export class CurrentUserPipe implements PipeTransform {
  constructor() {}
  async transform(user: any) {
    const userdb = await getRepository(Resources.USERS).findOneOrFail({
      where: { id: user.id },
      relations: ['oAuthTokens'],
    });
    return plainToClass(User, userdb);
  }
}
