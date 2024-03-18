import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { AdAccountDTO, Resources, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Body, Inject, Post } from '@nestjs/common';
import { OnboardWorkspaceService } from '@api/workspace/services/onboard-workspace.service';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { User } from '@api/user/data/user.entity';

@CompositionDecorator({ resource: Resources.WORKSPACES, controller: `${Resources.WORKSPACES}/onboard` })
export class OnboardWorkspaceController {
  @Inject(OnboardWorkspaceService)
  private readonly onboardWorkspaceService: OnboardWorkspaceService;

  @Post('')
  onboardWorkspace(
    @Body() body: { workspace: WorkspaceDTO; selectedAdAccounts: AdAccountDTO[] },
    @CurrentUser() user: Partial<User>,
  ) {
    const { workspace, selectedAdAccounts: adAccounts } = body;
    return this.onboardWorkspaceService.onboardWorkspace({ user, workspace, adAccounts });
  }
}
