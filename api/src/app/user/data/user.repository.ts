import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { EmailConflictException, EmailNotFoundException } from '@instigo-app/api-shared';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async saveNewUser(options: { payload }): Promise<User> {
    const { payload: user } = options;
    await this.assertEmail({
      email: user.email,
    });
    return this.save(user);
  }

  async findByEmail(options: { email: string }): Promise<User> {
    try {
      return await this.findOneOrFail({
        where: {
          email: options.email,
        },
      });
    } catch (error) {
      throw new EmailNotFoundException({ email: options.email });
    }
  }

  async assertEmail(options: { email: string }): Promise<void> {
    const { email } = options;
    if (email) {
      let userOfEmail;
      try {
        userOfEmail = await this.findByEmail(options);
      } catch (error) {
        userOfEmail = undefined;
      }
      if (userOfEmail) {
        throw new EmailConflictException({ email: options.email });
      }
    }
  }
}
