import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { User } from '@api/user/data/user.entity';
import { Actions, Resources, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Action, Crud, CrudController, Override } from '@nestjsx/crud';
import { Workspace } from '../data/workspace.entity';
import { WorkspaceNestCrudService } from '../services/workspace.nestcrud.service';
import { WorkspaceService } from '../services/workspace.service';

@Crud({
  model: {
    type: WorkspaceDTO,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      members: {
        eager: true,
        allow: [
          'id',
          'username',
          'email',
          'roles',
          'phone',
          'pictureUrl',
          'firstName',
          'lastName',
          'fullName',
          'updatedAt',
        ],
      },
      'members.oAuthTokens': {
        eager: true,
        alias: 'memberOAuthTokens',
        allow: ['id', 'provider', 'providerClientId', 'scope', 'createdAt', 'updatedAt', 'expiresAt', 'grantedAt'],
      },
      owner: {
        eager: true,
        allow: ['id', 'username', 'email', 'roles', 'phone', 'pictureUrl', 'firstName', 'lastName', 'fullName'],
        alias: 'owner',
      },
      'owner.oAuthTokens': {
        eager: true,
        alias: 'oAuthTokens',
        allow: [
          'id',
          'provider',
          'providerClientId',
          'scope',
          'status',
          'createdAt',
          'updatedAt',
          'expiresAt',
          'grantedAt',
        ],
      },
      adAccounts: {
        eager: true,
        exclude: ['providerMetadata'],
      },
      'adAccounts.pages': {
        eager: true,
        alias: 'pages',
        allow: ['providerId'],
      },
      inPendingMembers: {
        eager: true,
        allow: ['id', 'username', 'email', 'roles', 'phone', 'pictureUrl', 'firstName', 'lastName', 'fullName'],
      },
    },
  },
})
@CompositionDecorator({ resource: Resources.WORKSPACES })
export class WorkspaceController implements CrudController<Workspace> {
  constructor(public service: WorkspaceNestCrudService, private readonly workspaceService: WorkspaceService) {}

  @Action(Actions.ReadAll)
  @Override('getManyBase')
  async getAssignedWorkspaces(@CurrentUser() user: Partial<User>) {
    return this.workspaceService.getAssignedWorkspaces({ user });
  }

  @Action(Actions.DISABLE)
  @ApiResponse({ status: 200, description: 'Disable a workspace', type: [Workspace] })
  @Post(':id/disable')
  deleteWorkspace(@Param('id') id: string): Promise<Workspace> {
    return this.workspaceService.delete({ workspace: { id } });
  }

  @Action(Actions.LEAVE)
  @ApiResponse({ status: 200, description: 'Leave a workspace', type: [Workspace] })
  @Post(':id/leave')
  async leaveWorkspace(@Param('id') id: string, @CurrentUser() user: Partial<User>): Promise<Workspace> {
    return this.workspaceService.leave(id, user);
  }
}
