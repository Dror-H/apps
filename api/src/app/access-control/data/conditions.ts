import { Actions, Resources } from '@instigo-app/data-transfer-object';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { IDictionary, IFunctionCondition } from '@nest-toolbox/access-control';
import { ConfigService } from '@nestjs/config';
import { isNil, isUndefined } from 'lodash';
import { getManager, getRepository } from 'typeorm';
import { PermissionContext } from './types';
import {
  InstanceNotFoundException,
  InvalidOwnerException,
  InvalidWorkspaceMemberException,
  InvalidWorkspaceOwnerException,
  InvalidWorkspaceSubscriptionException,
  MissingParameterException,
  UnsupportedActionException,
} from '@instigo-app/api-shared';

async function checkInstanceById(params: { resource: Resources; url: string; user: User }): Promise<boolean> {
  const { resource, url, user } = params;
  const repository = getRepository(resource);
  const paramId = url.split('/')[2];
  const instance = (await repository.findOne({ id: paramId }, { relations: ['owner'] })) as any;
  if (isNil(instance)) {
    throw new InstanceNotFoundException({ entity: resource, id: paramId });
  }
  if (isUndefined(instance?.owner?.id) || instance.owner.id !== user.id) {
    throw new InvalidOwnerException({ user, resource });
  }
  return true;
}

function userSubscriptionIsValid(user: User): boolean {
  // TODO: When Stripe Integration ready, check stripeSubscriptionId presence and currentPeriodEnd is in future
  return true;
}

function hasWorkspaceId(workspaceId: string): void {
  if (!workspaceId) {
    throw new MissingParameterException({ parameter: 'current-workspace' });
  }
}

export const conditions = (configService: ConfigService): IDictionary<IFunctionCondition> => ({
  async isResourceOwner(context: PermissionContext, args: { resource: Resources }): Promise<boolean> {
    const { action, user, url } = context;
    const { resource } = args;
    switch (action) {
      case Actions.ReadOne:
        return checkInstanceById({ user, resource, url });
      case Actions.UpdateOne:
        return checkInstanceById({ user, resource, url });
      case Actions.ReplaceOne:
        return checkInstanceById({ user, resource, url });
      case Actions.DeleteOne:
        return checkInstanceById({ user, resource, url });
      case Actions.DISABLE:
        return checkInstanceById({ user, resource, url });
      case Actions.INVITE_MEMBER:
        return checkInstanceById({ user, resource, url });
      case Actions.ReadAll:
        // TODO: create query parser
        return true;
      case Actions.DeleteAll:
        // TODO: create query parser
        return true;
      default:
        throw new UnsupportedActionException({ action });
    }
  },

  async isWorkspaceMember(context: PermissionContext, args: { resource: Resources }): Promise<boolean> {
    const { user, workspaceId } = context;
    const { resource } = args;
    hasWorkspaceId(workspaceId);
    const manager = getManager();
    const workspace = await manager
      .createQueryBuilder(Workspace, 'w')
      .where('w.id = :id', { id: workspaceId })
      .leftJoinAndSelect('w.members', 'member')
      .getOne();

    if (workspace.members.some((member) => member.id === user.id)) {
      return true;
    }
    throw new InvalidWorkspaceMemberException({ user, resource, workspaceId });
  },

  async isWorkspaceOwner(context: PermissionContext, args: { resource: Resources }): Promise<boolean> {
    const { user, workspaceId } = context;
    const { resource } = args;
    hasWorkspaceId(workspaceId);
    const manager = getManager();
    const workspace = await manager
      .createQueryBuilder(Workspace, 'w')
      .where('w.id = :id', { id: workspaceId })
      .leftJoinAndSelect('w.owner', 'owner')
      .getOne();
    if (workspace.owner.id === user.id) {
      return true;
    }
    throw new InvalidWorkspaceOwnerException({ user, resource, workspaceId });
  },

  async isSubscribedWorkspaceMember(context: PermissionContext, args: { resource: Resources }): Promise<boolean> {
    const { user, workspaceId } = context;
    const { resource } = args;
    hasWorkspaceId(workspaceId);
    const manager = getManager();
    const workspace = await manager
      .createQueryBuilder(Workspace, 'w')
      .where('w.id = :id', { id: workspaceId })
      .leftJoinAndSelect('w.members', 'member')
      .leftJoinAndSelect('w.owner', 'owner')
      .getOne();
    const { members, owner } = workspace;
    if (!members.some((member) => member.id === user.id)) {
      throw new InvalidWorkspaceMemberException({ user, resource, workspaceId });
    }
    if (!userSubscriptionIsValid(owner)) {
      throw new InvalidWorkspaceSubscriptionException({ user, resource, workspaceId });
    }
    return true;
  },

  async isSubscribedWorkspaceOwner(context: PermissionContext, args: { resource: Resources }): Promise<boolean> {
    const { user, workspaceId } = context;
    const { resource } = args;
    hasWorkspaceId(workspaceId);
    const manager = getManager();
    const workspace = await manager
      .createQueryBuilder(Workspace, 'w')
      .where('w.id = :id', { id: workspaceId })
      .leftJoinAndSelect('w.owner', 'owner')
      .getOne();
    const { owner } = workspace;
    if (owner.id !== user.id) {
      throw new InvalidWorkspaceOwnerException({ user, resource, workspaceId });
    }
    if (!userSubscriptionIsValid(owner)) {
      throw new InvalidWorkspaceSubscriptionException({ user, resource, workspaceId });
    }
    return true;
  },
});
