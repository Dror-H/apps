import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { DefaultTimeRangePipe, ParseJSONPipe, ValidateBreakdown } from '@instigo-app/api-shared';
import { CampaignDetailsBreakdownTypes, Resources, TimeRange } from '@instigo-app/data-transfer-object';
import { DefaultValuePipe, Get, Inject, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { CampaignDetailsService } from './campaign-details.service';
import { CampaignInsightsBreakdownService } from './campaign-insights-breakdown.service';

@CompositionDecorator({ resource: Resources.CAMPAIGNS, controller: 'campaigns' })
export class CampaignDetailsController {
  @Inject(CampaignDetailsService)
  campaignDetailsService: CampaignDetailsService;

  @Inject(CampaignInsightsBreakdownService)
  private readonly campaignInsightsBreakdownService: CampaignInsightsBreakdownService;

  @Get('details/:id')
  details(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.campaignDetailsService.details({ id });
  }

  @Get('insights/:id')
  breakdown(
    @CurrentWorkspaceId(CurrentWorkspacePipe) workspace: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('breakdown', new DefaultValuePipe('NONE'), ValidateBreakdown) breakdown: CampaignDetailsBreakdownTypes,
    @Query('time_range', ParseJSONPipe, DefaultTimeRangePipe) timeRange: TimeRange,
  ) {
    if (breakdown === CampaignDetailsBreakdownTypes.NONE) {
      return this.campaignDetailsService.overview({ id, timeRange, workspace });
    }
    return this.campaignInsightsBreakdownService.insights({ id, timeRange, breakdown, workspace });
  }
}
