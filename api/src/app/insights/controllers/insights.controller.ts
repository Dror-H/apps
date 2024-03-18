import { DefaultTimeRangePipe, ParseJSONPipe } from '@instigo-app/api-shared';
import {
  Actions,
  CacheTtlSeconds,
  ProviderParameters,
  Resources,
  TimeIncrement,
  TimeRange,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { CACHE_MANAGER, Get, Inject, Param, Query, UseInterceptors } from '@nestjs/common';
import { Action, CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { Cache } from 'cache-manager';
import { format } from 'date-fns';
import { CompositionDecorator } from '../../shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '../../shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '../../shared/current-workspace.pipe';
import { InsightsTableService } from '../services/insights-table.service';
import { ResourceInsightsService } from '../services/resource-insights.service';

@CompositionDecorator({ resource: Resources.INSIGHTS })
export class InsightsController {
  @Inject(ResourceInsightsService)
  private readonly resourceInsightsService: ResourceInsightsService;

  @Inject(InsightsTableService)
  private readonly insightsTableService: InsightsTableService;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  @UseInterceptors(CrudRequestInterceptor)
  @Action(Actions.READ_INSIGHTS)
  @Get('table/:type')
  async tableInsights(
    @Param('type') type: Resources,
    @Query('time_increment') timeIncrement: TimeIncrement,
    @Query('time_range', ParseJSONPipe, DefaultTimeRangePipe) timeRange: TimeRange,
    @Query('provider_parameters', ParseJSONPipe) providerParameters: Partial<ProviderParameters>,
    @ParsedRequest() crudRequest: CrudRequest,
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const insights = await this.insightsTableService.insights({
      type,
      timeIncrement,
      timeRange,
      providerParameters,
      crudRequest,
      workspace,
    });
    return insights;
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Action(Actions.READ_INSIGHTS)
  @Get(':type')
  async insights(
    @Param('type') type: Resources,
    @Query('time_increment') timeIncrement: TimeIncrement,
    @Query('time_range', ParseJSONPipe, DefaultTimeRangePipe) timeRange: TimeRange,
    @Query('provider_parameters', ParseJSONPipe) providerParameters: Partial<ProviderParameters>,
    @ParsedRequest() crudRequest: CrudRequest,
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: WorkspaceDTO,
  ) {
    const cacheKey = `insights-${type}-${JSON.stringify(timeIncrement)}-${JSON.stringify({
      since: format(new Date(timeRange.start), 'yyyy-MM-dd'),
      until: format(new Date(timeRange.end), 'yyyy-MM-dd'),
    })}-${JSON.stringify(providerParameters)}-${workspace.id}-${JSON.stringify(crudRequest)}`;
    const cachedInsights = await this.cacheManager.get(cacheKey);
    if (cachedInsights) {
      return cachedInsights;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const insights = await this.resourceInsightsService
      .insights({
        type,
        timeIncrement,
        timeRange,
        providerParameters,
        crudRequest,
        workspace,
      })
      .toPromise();
    await this.cacheManager.set(cacheKey, insights, { ttl: CacheTtlSeconds.FIVE_MINUTES });
    return insights;
  }
}
