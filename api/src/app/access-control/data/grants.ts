import { Actions, Resources, Roles } from '@instigo-app/data-transfer-object';
import { CustomConditions } from './types';
const ALL_ACTIONS = Object.values(Actions);

export const grants = {
  [Roles.USER]: {
    // TODO: Add restrictions for Resources.UTILITY_UPLOADS and for Read.All endpoints (check filter in customConditions)
    grants: [
      {
        resource: Resources.WORKSPACES,
        action: [Actions.CreateOne, Actions.CreateMany],
        attributes: ['*'],
      },
      {
        resource: Resources.WORKSPACES,
        action: [Actions.ReadOne, Actions.ReadAll, Actions.LEAVE],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.WORKSPACES },
        },
      },
      {
        resource: Resources.WORKSPACES,
        action: [Actions.UpdateOne, Actions.ReplaceOne, Actions.DeleteOne, Actions.INVITE_MEMBER, Actions.DISABLE],
        attributes: ['*'],
        condition: {
          Fn: 'OR',
          args: [
            {
              Fn: CustomConditions.IS_WORKSPACE_OWNER,
              args: { resource: Resources.WORKSPACES },
            },
            {
              Fn: CustomConditions.IS_RESOURCE_OWNER,
              args: { resource: Resources.WORKSPACES },
            },
          ],
        },
      },
      {
        resource: Resources.AD_ACCOUNTS,
        action: [Actions.CreateOne, Actions.CreateMany, Actions.READ_AVAILABLE],
        attributes: ['*'],
      },
      {
        resource: Resources.AD_ACCOUNTS,
        action: [Actions.ReadOne, Actions.READ_INSIGHTS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.AD_ACCOUNTS },
        },
      },
      {
        resource: Resources.AD_ACCOUNTS,
        action: [Actions.DeleteOne],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_OWNER,
          args: { resource: Resources.AD_ACCOUNTS },
        },
      },
      {
        resource: Resources.NOTIFICATIONS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.NOTIFICATIONS },
        },
      },
      {
        resource: Resources.CAMPAIGNS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.CAMPAIGNS },
        },
      },
      {
        resource: Resources.CAMPAIGN_DRAFTS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.CAMPAIGN_DRAFTS },
        },
      },
      {
        resource: Resources.CAMPAIGN_GROUP,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.CAMPAIGN_GROUP },
        },
      },
      {
        resource: Resources.AD_SETS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.AD_SETS },
        },
      },
      {
        resource: Resources.ADS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.ADS },
        },
      },
      {
        resource: Resources.INSIGHTS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.INSIGHTS },
        },
      },
      {
        resource: Resources.AUDIENCES,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.AUDIENCES },
        },
      },
      {
        resource: Resources.TARGETING_TEMPLATES,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.TARGETING_TEMPLATES },
        },
      },

      {
        resource: Resources.AD_TEMPLATES,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.AD_TEMPLATES },
        },
      },
      {
        resource: Resources.FILES,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.FILES },
        },
      },
      {
        resource: Resources.REPORTS,
        action: [...ALL_ACTIONS],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.REPORTS },
        },
      },
      {
        resource: Resources.ME,
        action: [
          Actions.ReadOne,
          Actions.UpdateOne,
          Actions.CREATE_CUSTOMER,
          Actions.CREATE_TAX_ID,
          Actions.GET_TAX_ID,
          Actions.DELETE_TAX_ID,
          Actions.DeleteOne,
        ],
        attributes: ['*'],
      },
      {
        resource: Resources.SUBSCRIPTIONS,
        action: [Actions.ReadOne, Actions.UpdateOne, Actions.DeleteOne],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_RESOURCE_OWNER,
          args: { resource: Resources.SUBSCRIPTIONS },
        },
      },
      {
        resource: Resources.SUBSCRIPTIONS,
        action: [Actions.CreateOne, Actions.RETRY_INVOICE],
        attributes: ['*'],
        // TODO: set custom conditions and limit access to plan attribute
      },
      {
        resource: Resources.POSTS,
        action: [Actions.ReadOne, Actions.ReadAll],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.POSTS },
        },
      },
      {
        resource: Resources.LEADGEN_FORM,
        action: [Actions.ReadOne, Actions.ReadAll, Actions.CreateOne],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.LEADGEN_FORM },
        },
      },
      {
        resource: Resources.EVENTS,
        action: [Actions.ReadOne, Actions.ReadAll],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.EVENTS },
        },
      },
      {
        resource: Resources.PAGE,
        action: [Actions.ReadOne, Actions.ReadAll],
        attributes: ['*'],
        condition: {
          Fn: CustomConditions.IS_WORKSPACE_MEMBER,
          args: { resource: Resources.PAGE },
        },
      },
    ],
  },
  [Roles.ADMIN]: {
    grants: [
      {
        resource: Resources.WORKSPACES,
        action: [Actions.ReadOne, Actions.ReadAll],
        attributes: ['*'],
      },
      {
        resource: Resources.CAMPAIGNS,
        action: [Actions.ReadOne, Actions.ReadAll],
        attributes: ['*'],
      },
      {
        resource: Resources.SUBSCRIPTIONS,
        action: [Actions.ReadOne, Actions.ReadAll, Actions.UpdateOne, Actions.ReplaceOne, Actions.UpdateOne],
        attributes: ['*'],
      },
    ],
  },
};
