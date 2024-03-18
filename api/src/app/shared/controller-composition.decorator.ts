import { ACLGuard } from '@api/access-control/access-control.guard';
import { Resources } from '@instigo-app/data-transfer-object';
import { Resource } from '@nest-toolbox/access-control';
import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function CompositionDecorator({
  resource,
  useGuards = true,
  authGuardType = 'jwt',
  controller,
  apiTag,
}: {
  resource: Resources;
  useGuards?: boolean;
  authGuardType?: string;
  controller?: string;
  apiTag?: string;
}) {
  const decorators = [Controller(controller || resource), ApiTags(apiTag || resource), Resource(resource)];
  if (useGuards) {
    decorators.push(UseGuards(AuthGuard(authGuardType), ACLGuard, ApiBearerAuth));
  }
  return applyDecorators(...decorators);
}
