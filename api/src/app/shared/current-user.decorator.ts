import { User } from '@api/user/data/user.entity';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): Partial<User> => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
