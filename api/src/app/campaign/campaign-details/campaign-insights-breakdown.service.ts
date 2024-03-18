import { InsightsUtilService } from '@api/insights/services/insights-util.service';
import { ResourceInsightsService } from '@api/insights/services/resource-insights.service';
import {
  CampaignDetailsBreakdownTypes,
  FacebookBreakdownType,
  LinkedinBreakdownType,
  SupportedProviders,
  TimeRange,
} from '@instigo-app/data-transfer-object';
import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import to from 'await-to-js';
import { Connection } from 'typeorm';
import { Campaign } from '../data/campaign.entity';

@Injectable()
export class CampaignInsightsBreakdownService {
  private readonly logger = new Logger('CampaignInsightsBreakdownService');

  @Inject(Connection)
  private readonly connection: Connection;

  @Inject(ResourceInsightsService)
  private readonly resourceInsightsService: ResourceInsightsService;

  @Inject(InsightsUtilService)
  private readonly insightsUtilService: InsightsUtilService;

  async insights(options: {
    id: string;
    timeRange: TimeRange;
    breakdown: CampaignDetailsBreakdownTypes;
    workspace: any;
  }) {
    const { id, timeRange, breakdown, workspace } = options;
    const [err, campaign] = await to(
      this.connection.createQueryBuilder(Campaign, 'campaign').select().where('campaign.id = :id', { id }).getOne(),
    );

    if (err || !campaign) {
      this.logger.error(err);
      throw new NotFoundException('Campaign not found');
    }

    // TODO: work to get the 3 party breakdown
    // if (!workspace.settings.useCachedInsights) {
    // }

    if (campaign.provider === SupportedProviders.FACEBOOK) {
      const [error, result] = await to(this.facebookBreakdown({ timeRange, breakdown, campaign }));
      if (error) {
        this.logger.error(error);
        throw new InternalServerErrorException('Error while fetching insights');
      }
      return result;
    }
    if (campaign.provider === SupportedProviders.LINKEDIN) {
      const [error, result] = await to(this.linkedinBreakdown({ timeRange, breakdown, campaign }));
      if (error) {
        this.logger.error(error);
        throw new InternalServerErrorException('Error while fetching insights');
      }
      return result;
    }
  }

  async facebookBreakdown(options: {
    timeRange: TimeRange;
    breakdown: CampaignDetailsBreakdownTypes;
    campaign: Campaign;
  }) {
    const { timeRange, campaign, breakdown } = options;
    const fieldsByBreakdown = {
      [CampaignDetailsBreakdownTypes.AGE_AND_GENDER]: ['age', 'gender'].join(','),
      [CampaignDetailsBreakdownTypes.AGE]: ['age'].join(','),
      [CampaignDetailsBreakdownTypes.GENDER]: ['gender'].join(','),
      [CampaignDetailsBreakdownTypes.COUNTRY_AND_REGION]: ['country', 'region'].join(','),
      [CampaignDetailsBreakdownTypes.COUNTRY]: ['country'].join(','),
      [CampaignDetailsBreakdownTypes.REGION]: ['region'].join(','),
      [CampaignDetailsBreakdownTypes.PUBLISHER_AND_POSITION]: ['publisher_platform', 'platform_position'].join(','),
      [CampaignDetailsBreakdownTypes.PUBLISHER]: ['publisher_platform'].join(','),
      [CampaignDetailsBreakdownTypes.POSITION]: ['platform_position'].join(','),
      [CampaignDetailsBreakdownTypes.DEVICE]: ['device_platform'].join(','),
      [CampaignDetailsBreakdownTypes.HOURLY]: ['hourly_range'].join(','),
    };
    const breakdownWhere = {
      [CampaignDetailsBreakdownTypes.AGE_AND_GENDER]: FacebookBreakdownType.AGE_AND_GENDER,
      [CampaignDetailsBreakdownTypes.AGE]: FacebookBreakdownType.AGE_AND_GENDER,
      [CampaignDetailsBreakdownTypes.GENDER]: FacebookBreakdownType.AGE_AND_GENDER,
      [CampaignDetailsBreakdownTypes.COUNTRY_AND_REGION]: FacebookBreakdownType.COUNTRY_AND_REGION,
      [CampaignDetailsBreakdownTypes.COUNTRY]: FacebookBreakdownType.COUNTRY_AND_REGION,
      [CampaignDetailsBreakdownTypes.REGION]: FacebookBreakdownType.COUNTRY_AND_REGION,
      [CampaignDetailsBreakdownTypes.PUBLISHER_AND_POSITION]: FacebookBreakdownType.PUBLISHER_AND_POSITION,
      [CampaignDetailsBreakdownTypes.PUBLISHER]: FacebookBreakdownType.PUBLISHER_AND_POSITION,
      [CampaignDetailsBreakdownTypes.POSITION]: FacebookBreakdownType.PUBLISHER_AND_POSITION,
      [CampaignDetailsBreakdownTypes.DEVICE]: FacebookBreakdownType.DEVICE,
      [CampaignDetailsBreakdownTypes.HOURLY]: FacebookBreakdownType.HOURLY,
    };

    const query = `
    SELECT ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.facebookSumMetrics())}, ${
      fieldsByBreakdown[breakdown]
    }
    FROM facebook_insights
    where
    campaign_id='${campaign.providerId}'
    and breakdown='${breakdownWhere[breakdown]}'
    ${this.insightsUtilService.whereTime({ timeRange })}\n GROUP BY ${fieldsByBreakdown[breakdown]};`;
    const data = await this.connection.manager.query(query);
    return { data };
  }

  async linkedinBreakdown(options: {
    timeRange: TimeRange;
    breakdown: CampaignDetailsBreakdownTypes;
    campaign: Campaign;
  }) {
    const { timeRange, campaign, breakdown } = options;
    const fieldsByBreakdown = {
      [CampaignDetailsBreakdownTypes.INDUSTRY]: ['industry'].join(','),
      [CampaignDetailsBreakdownTypes.SENIORITY]: ['seniority'].join(','),
      [CampaignDetailsBreakdownTypes.JOB_TITLE]: ['job_title'].join(','),
      [CampaignDetailsBreakdownTypes.JOB_FUNCTION]: ['job_function'].join(','),
      [CampaignDetailsBreakdownTypes.COUNTRY]: ['country'].join(','),
      [CampaignDetailsBreakdownTypes.REGION]: ['region'].join(','),
      [CampaignDetailsBreakdownTypes.COMPANY]: ['company'].join(','),
      [CampaignDetailsBreakdownTypes.COMPANY_SIZE]: ['company_size'].join(','),
    };
    const breakdownWhere = {
      [CampaignDetailsBreakdownTypes.INDUSTRY]: LinkedinBreakdownType.INDUSTRY,
      [CampaignDetailsBreakdownTypes.SENIORITY]: LinkedinBreakdownType.SENIORITY,
      [CampaignDetailsBreakdownTypes.JOB_TITLE]: LinkedinBreakdownType.JOB_TITLE,
      [CampaignDetailsBreakdownTypes.JOB_FUNCTION]: LinkedinBreakdownType.JOB_FUNCTION,
      [CampaignDetailsBreakdownTypes.COUNTRY]: LinkedinBreakdownType.COUNTRY,
      [CampaignDetailsBreakdownTypes.REGION]: LinkedinBreakdownType.REGION,
      [CampaignDetailsBreakdownTypes.COMPANY]: LinkedinBreakdownType.COMPANY,
      [CampaignDetailsBreakdownTypes.COMPANY_SIZE]: LinkedinBreakdownType.COMPANY_SIZE,
    };

    const query = `
    SELECT ${this.insightsUtilService.jsonToSelection(this.insightsUtilService.linkedinSumMetrics())}, ${
      fieldsByBreakdown[breakdown]
    }
    FROM linkedin_insights
    where
    campaign_id='${campaign.providerId}'
    and breakdown='${breakdownWhere[breakdown]}'
    ${this.insightsUtilService.whereTime({ timeRange })}\n GROUP BY ${fieldsByBreakdown[breakdown]};`;
    const data = await this.connection.manager.query(query);
    return { data };
  }
}
