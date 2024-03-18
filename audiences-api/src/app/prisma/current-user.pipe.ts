import { Inject, Injectable, Logger, NotFoundException, PipeTransform } from '@nestjs/common';
import { User } from '@prisma/client';
import to from 'await-to-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrentUserPipe implements PipeTransform {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger('CurrentUserPipe');

  async transform(user: Partial<User>): Promise<Partial<User>> {
    const [error, result] = await to(
      this.prismaService.user.findUnique({
        where: { id: user.id },
        select: {
          authTokens: true,
          password: false,
          email: true,
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          emailVerified: true,
        },
      }),
    );
    if (error) {
      this.logger.error(error);
      throw new NotFoundException('User not found');
    }
    return result;
  }
}
