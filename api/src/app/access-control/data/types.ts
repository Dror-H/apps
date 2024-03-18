import { User } from '@api/user/data/user.entity';
import { Actions } from '@instigo-app/data-transfer-object';

export type PermissionContext = {
  [key: string]: any;
  action?: Actions;
  workspaceId?: string;
  signature?: string;
  user?: User;
  body?: any;
  url?: string;
  query?: any;
};

export enum CustomConditions {
  IS_RESOURCE_OWNER = 'custom:isResourceOwner',
  IS_WORKSPACE_MEMBER = 'custom:isWorkspaceMember',
  IS_WORKSPACE_OWNER = 'custom:isWorkspaceOwner',
  IS_SUBSCRIBED_WORKSPACE_MEMBER = 'custom:isSubscribedWorkspaceMember',
  IS_SUBSCRIBED_WORKSPACE_OWNER = 'custom:isSubscribedWorkspaceOwner',
}
