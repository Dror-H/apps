import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { WorkspaceDashboardService } from '@api/workspace/services/workspace-dashboard.service';
import { ParseJSONPipe } from '@instigo-app/api-shared';
import { Actions, Resources, TimeRange } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Get, Inject, Query } from '@nestjs/common';
import { endOfDay, subDays } from 'date-fns';

@CompositionDecorator({
  resource: Resources.WORKSPACES,
  controller: `workspaces-dashboard`,
  useGuards: true,
})
export class WorkspaceDashboardController {
  @Inject()
  private workspaceDashboardService: WorkspaceDashboardService;

  @Action(Actions.ReadOne)
  @Get()
  dashboard(@Query('time_range', ParseJSONPipe) timeRange: TimeRange, @CurrentWorkspaceId() workspaceId: string) {
    if (!timeRange) {
      timeRange = {
        start: subDays(new Date(), 30),
        end: endOfDay(new Date()),
      };
    }
    return this.workspaceDashboardService.dashboard({ workspaceId, timeRange });
  }
}
