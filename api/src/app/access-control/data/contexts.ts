import { Actions, Resources } from '@instigo-app/data-transfer-object';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as queryString from 'query-string';
import { PermissionContext } from './types';

const getPermissionContextByResource = {
  [Resources.ADS]: applyWorkspaceContext,
  [Resources.AD_SETS]: applyWorkspaceContext,
  [Resources.AD_TEMPLATES]: applyWorkspaceContext,
  [Resources.AD_ACCOUNTS]: applyWorkspaceContext,
  [Resources.AUDIENCES]: applyWorkspaceContext,
  [Resources.CAMPAIGNS]: applyWorkspaceContext,
  [Resources.CAMPAIGN_DRAFTS]: applyWorkspaceContext,
  [Resources.CAMPAIGN_GROUP]: applyWorkspaceContext,
  [Resources.TARGETING_TEMPLATES]: applyWorkspaceContext,
  [Resources.WORKSPACES]: applyWorkspaceContext,
  [Resources.INSIGHTS]: applyWorkspaceContext,
  [Resources.FILES]: applyWorkspaceContext,
  [Resources.SUBSCRIPTIONS]: applyWorkspaceContext,
  [Resources.POSTS]: applyWorkspaceContext,
  [Resources.NOTIFICATIONS]: applyWorkspaceContext,
  [Resources.LEADGEN_FORM]: applyWorkspaceContext,
  [Resources.EVENTS]: applyWorkspaceContext,
  [Resources.PAGE]: applyWorkspaceContext,
};

const getPermissionContextByAction = {
  [Actions.SUBSCRIPTION_WEBHOOK]: applySubscriptionWebhookContext,
};

function applyDefaultContext(
  action: Actions,
  request: Request,
): { action: Actions; body?: any; url?: string; query?: queryString.ParsedQuery<string> } {
  const { url, query } = queryString.parseUrl(request.url, { arrayFormat: 'comma' });
  return { action, url, query, body: request.body };
}

function applyWorkspaceContext(_action: Actions, request: Request): { workspaceId: string } {
  const workspaceId = request.headers['current-workspace'];
  return { workspaceId } as any;
}

function applySubscriptionWebhookContext(request: Request): { signature: string } {
  const signature = request.headers['stripe-signature'];
  return { signature } as any;
}

export function getPermissionContext(
  action: Actions,
  resource: Resources,
  context: ExecutionContext,
): Promise<PermissionContext> {
  const request = context.switchToHttp().getRequest<Request>();
  const defaultPermissionContext = applyDefaultContext(action, request);
  const resourcePermissionContext = getPermissionContextByResource[resource]
    ? getPermissionContextByResource[resource](action, request)
    : {};
  const actionPermissionContext = getPermissionContextByAction[action]
    ? getPermissionContextByAction[action](request)
    : {};
  return { ...defaultPermissionContext, ...resourcePermissionContext, ...actionPermissionContext };
}
