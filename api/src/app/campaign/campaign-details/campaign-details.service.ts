import { InsightsUtilService } from '@api/insights/services/insights-util.service';
import { ResourceInsightsService } from '@api/insights/services/resource-insights.service';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { Resources, SupportedProviders, TimeIncrement, TimeRange } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import to from 'await-to-js';
import { differenceInCalendarDays, sub } from 'date-fns';
import { Connection } from 'typeorm';
import { Campaign } from '../data/campaign.entity';

@Injectable()
export class CampaignDetailsService {
  private readonly logger = new Logger('CampaignDetailsService');

  @Inject(Connection)
  private readonly connection: Connection;

  @Inject(ResourceInsightsService)
  private readonly resourceInsightsService: ResourceInsightsService;

  @Inject(InsightsUtilService)
  private readonly insightsUtilService: InsightsUtilService;

  async details(options: { id: string }) {
    const { id } = options;
    const [err, campaign] = await to(
      this.connection
        .createQueryBuilder(Campaign, 'campaign')
        .select()
        .where('campaign.id = :id', { id })
        .leftJoinAndSelect('campaign.adAccount', 'adAccount')
        .leftJoinAndSelect('campaign.adSets', 'adSets')
        .getOne(),
    );
    if (err || !campaign) {
      this.logger.error(err);
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  async overview(options: { id: string; timeRange: TimeRange; workspace: Workspace }) {
    const { id, timeRange, workspace } = options;

    const [err, campaign] = await to(
      this.connection.createQueryBuilder(Campaign, 'campaign').select().where('campaign.id = :id', { id }).getOne(),
    );

    if (err) {
      this.logger.error(err);
      throw new NotFoundException('Campaign not found');
    }

    if (!workspace.settings.useCachedInsights) {
      const [err, result] = await to(
        this.resourceInsightsService
          .fetchInsights({
            workspace,
            entries: [campaign],
            provider: campaign.provider,
            type: Resources.CAMPAIGNS,
            timeRange,
            timeIncrement: TimeIncrement.DAILY,
            providerParameters: { versus: true },
          })
          .toPromise(),
      );
      if (err) {
        return { data: [], summary: {} };
      }
      return result[0].insights;
    }

    const versusTimeRange: TimeRange = {
      start: sub(new Date(timeRange.start), {
        days: Math.abs(differenceInCalendarDays(new Date(timeRange.start), new Date(timeRange.end))),
      }),
      end: timeRange.start,
    };

    if (campaign.provider === SupportedProviders.FACEBOOK) {
      const data = await this.connection.manager.query(`
      SELECT date, ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.facebookRowMetrics())}
      FROM facebook_insights
      where
      campaign_id='${campaign.providerId}'
      and breakdown='NONE' ${this.insightsUtilService.whereTime({ timeRange })}\n`);

      const summary = await this.connection.manager.query(`
      SELECT ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.facebookSumMetrics())}
      FROM facebook_insights
      where
      campaign_id='${campaign.providerId}'
      and spend>0
      and breakdown='NONE' ${this.insightsUtilService.whereTime({ timeRange })}\n`);

      const versusSummary = await this.connection.manager.query(`
      SELECT ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.facebookSumMetrics())}
      FROM facebook_insights
      where
      campaign_id='${campaign.providerId}'
      and spend>0
      and breakdown='NONE' ${this.insightsUtilService.whereTime({ timeRange: versusTimeRange })}\n`);

      return { data, summary, versusSummary: versusSummary };
    }

    if (campaign.provider === SupportedProviders.LINKEDIN) {
      const data = await this.connection.manager.query(`
      SELECT date, ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.linkedinRowMetrics())}
      FROM linkedin_insights
      where
      campaign_id='${campaign.providerId}'
      and spend>0
      and breakdown='NONE' ${this.insightsUtilService.whereTime({ timeRange })}\n`);

      const summary = await this.connection.manager.query(`
      SELECT ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.linkedinSumMetrics())}
      FROM linkedin_insights
      where
      campaign_id='${campaign.providerId}'
      and spend>0
      and breakdown='NONE' ${this.insightsUtilService.whereTime({ timeRange })}\n`);

      const versusSummary = await this.connection.manager.query(`
      SELECT ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.linkedinSumMetrics())}
      FROM linkedin_insights
      where
      campaign_id='${campaign.providerId}'
      and spend>0
      and breakdown='NONE' ${this.insightsUtilService.whereTime({ timeRange: versusTimeRange })}\n`);

      return { data, summary, versusSummary: versusSummary };
    }
  }
}
