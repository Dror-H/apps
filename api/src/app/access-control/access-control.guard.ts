import { Actions, Resources, Roles } from '@instigo-app/data-transfer-object';
import { getAction as GetAclAction, InjectRulesBuilder, RulesBuilder, getResource } from '@nest-toolbox/access-control';
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { getAction, getFeature } from '@nestjsx/crud';
import { getPermissionContext } from './data';

@Injectable()
export class ACLGuard implements CanActivate {
  constructor(@InjectRulesBuilder() private readonly ruleBuilder: RulesBuilder) {}

  protected getUser(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return { user };
  }

  protected async getUserRoles(context: ExecutionContext): Promise<{ user: any; roles: Roles[] }> {
    const { user } = await this.getUser(context);
    if (!user) {
      return { user: null, roles: [Roles.NONE] };
    }
    return { user, roles: user?.roles };
  }

  isSuperAdmin(roles: Roles[]) {
    return roles.some((role) => role === Roles.SUPER_ADMIN);
  }

  protected getActionAndResource(context: ExecutionContext): { action: Actions; resource: Resources } {
    const handler = context.getHandler();
    const controller = context.getClass();
    const resource = getFeature(controller) || getResource(controller);
    const action = getAction(handler) || GetAclAction(handler);
    return { action, resource };
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, roles: userRoles } = await this.getUserRoles(context);
    if (this.isSuperAdmin(userRoles)) {
      return true;
    }
    const { action, resource } = this.getActionAndResource(context);
    if (!resource || !action) {
      return true;
    }
    const permissionContext = { user, ...(await getPermissionContext(action, resource, context)) };
    try {
      const permission = await this.ruleBuilder.can(userRoles).context(permissionContext).execute(action).on(resource);
      return permission.granted;
    } catch (error) {
      throw error instanceof HttpException ? error : new HttpException(error.message, 403);
    }
  }
}
