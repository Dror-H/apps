import { ACLGuard } from '@api/access-control/access-control.guard';
import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { Actions, Resources } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Body, Get, HttpStatus, Inject, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Redirect, RedirectOptions } from '@nestjsplus/redirect';
import { WorkspaceInvitationService } from '../services/workspace-invitation.service';

@CompositionDecorator({ resource: Resources.WORKSPACES, controller: 'workspace-invite', useGuards: false })
export class WorkspaceInvitationsController {
  private readonly logger = new Logger(WorkspaceInvitationsController.name);

  @Inject(WorkspaceInvitationService)
  private readonly workspaceInvitationService: WorkspaceInvitationService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Action(Actions.INVITE_MEMBER)
  @UseGuards(AuthGuard('jwt'), ACLGuard)
  @Post(':id/invite')
  async inviteMemberToWorkspace(@Body() body: { email: string }, @Param('id') workspaceId: string) {
    const { email } = body;
    return this.workspaceInvitationService.sendInviteMail({ email, workspaceId });
  }

  @Get('confirm')
  @Redirect()
  async verifyInvitationEmail(@Query('token') token: string): Promise<RedirectOptions> {
    try {
      return await this.workspaceInvitationService.verifyInvitationEmail({ token });
    } catch (error) {
      this.logger.error(error.message);
      return {
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
        url: `${this.configService.get<string>('FRONTEND_HOST')}/auth/expired-invitation`,
      };
    }
  }
}
