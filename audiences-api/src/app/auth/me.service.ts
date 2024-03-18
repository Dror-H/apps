import { CustomerService } from '@audiences-api/account-control/customer.service';
import { MeDTO, UserDTO } from '@audiences-api/zod-schemas';
import { ResponseError, ResponseSuccess, SupportedProviders, TokenStatus } from '@instigo-app/data-transfer-object';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import to from 'await-to-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ThirdPartyAuthApiService)
  private readonly thirdPartyAuthApiService: ThirdPartyAuthApiService;

  @Inject(CustomerService)
  private readonly customerService: CustomerService;

  private readonly logger = new Logger('MeService');

  async me(options: { id: string }): Promise<MeDTO> {
    const { id } = options;
    const [error, result] = await to(
      this.prismaService.user.findUnique({
        where: { id },
        select: {
          adAccounts: true,
          password: false,
          email: true,
          phone: true,
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          emailVerified: true,
          isAdmin: true,
          createdAt: true,
          billing: true,
          stripeSubscriptionId: true,
        },
      }),
    );
    if (error || !result) {
      this.logger.error(error);
      throw new NotFoundException('User not found');
    }
    result.stripeSubscriptionId = 'sub_123456789';
    const token = await this.prismaService.authToken.findFirst({ where: { user: { id: result.id } } });
    const [, tokenIntrospection] = await to(
      this.thirdPartyAuthApiService.inspectToken({
        accessToken: token.accessToken,
        provider: SupportedProviders.FACEBOOK,
      }),
    );
    if (tokenIntrospection?.status !== TokenStatus.ACTIVE || token?.status !== tokenIntrospection.status) {
      throw new BadRequestException('User token expired please login again');
    }
    // todo - make type jsonB compatible with zod schema on field "billing"
    return { ...(result as MeDTO), lastLogin: new Date() };
  }

  async updateMe({ id, user }: { id: string; user: UserDTO }): Promise<MeDTO> {
    const updated = await this.prismaService.user.update({
      select: {
        id: true,
      },
      data: user,
      where: {
        id: id,
      },
    });
    if (user.billing) {
      await this.customerService.updateCustomer({ user: updated });
    }
    return this.me({ id: updated.id });
  }

  async deleteMe({ id }: { id: string }): Promise<ResponseSuccess | ResponseError> {
    const [, token] = await to(this.prismaService.authToken.findFirst({ where: { userId: id } }));
    const [deleteError] = await this.prismaService.$transaction([
      this.prismaService.authToken.delete({ where: { id: token.id } }),
      this.prismaService.user.delete({ where: { id: id } }),
    ]);
    if (deleteError) {
      this.logger.error(deleteError);
      return new ResponseError('Fail to delete the user');
    }
    return new ResponseSuccess('User Deleted');
  }
}
