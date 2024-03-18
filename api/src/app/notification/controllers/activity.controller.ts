import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { Actions, Resources, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Get, Inject, Query } from '@nestjs/common';
import { NotificationRepository } from '../services/notification.repository';

@CompositionDecorator({
  resource: Resources.NOTIFICATIONS,
  controller: `activity`,
})
export class NotificationsActivityController {
  @Inject(NotificationRepository)
  private readonly notificationService: NotificationRepository;

  @Action(Actions.ReadAll)
  @Get()
  activity(@CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO, @Query('take') take: number) {
    return this.notificationService.activity({ workspace, take });
  }
}
