import { Inject, Injectable, Logger, NotFoundException, PipeTransform } from '@nestjs/common';
import { User } from '@prisma/client';
import to from 'await-to-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrentAccessTokenPipe implements PipeTransform {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger('CurrentUserPipe');

  async transform(user: User): Promise<string> {
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
    if (error || !result) {
      this.logger.error(error);
      throw new NotFoundException('User not found');
    }
    return result.authTokens?.find((token) => token.provider === 'facebook')?.accessToken || undefined;
  }
}
