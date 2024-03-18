import {
  InsightsLevel,
  ProviderParameters,
  Resources,
  TimeIncrement,
  TimeRange,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import to from 'await-to-js';
import { format } from 'date-fns';
import { isNil } from 'lodash';
import { getManager } from 'typeorm';
import { InsightsUtilService } from './insights-util.service';
import {
  ad_account_fields,
  ad_fields,
  ad_set_fields,
  campaign_fields,
  getInsights,
  mapApiAd,
  mapApiAdset,
  mapApiCampaign,
} from './insights.helper';
import { ResourceInsightsService } from './resource-insights.service';

@Injectable()
export class InsightsTableService {
  private readonly logger = new Logger(InsightsTableService.name);

  @Inject(ResourceInsightsService)
  private readonly resourceInsightsService: ResourceInsightsService;

  @Inject(InsightsUtilService)
  private readonly insightsUtilService: InsightsUtilService;

  async insights(options: {
    type: Resources;
    timeIncrement: TimeIncrement | number;
    timeRange: TimeRange;
    providerParameters: Partial<ProviderParameters>;
    crudRequest: CrudRequest;
    workspace: WorkspaceDTO;
  }) {
    const { type, timeRange, crudRequest, workspace } = options;
    if (workspace?.settings?.useCachedInsights === true) {
      return this.get({
        level: type as unknown as InsightsLevel,
        timeRange,
        filter: crudRequest.parsed.filter as unknown as { field: string; operator: string; value: string }[],
        sort: crudRequest.parsed.sort as unknown as { field: string; order: string }[],
        limit: crudRequest.parsed.limit,
        offset: crudRequest.parsed.offset,
        paginate: !!crudRequest.parsed.page,
        workspace,
      });
    }
    const [err, result] = await to(this.resourceInsightsService.insights(options).toPromise());

    if (Array.isArray(result)) {
      return { data: [] };
    }
    if (type === Resources.CAMPAIGNS) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result.data = result.data.map((item) => mapApiCampaign(item));
      return result;
    }
    if (type === Resources.AD_SETS) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result.data = result.data.map((item) => mapApiAdset(item));
      return result;
    }
    if (type === Resources.ADS) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result.data = result.data.map((item) => mapApiAd(item));
      return result;
    }
  }

  async get(options: {
    level: InsightsLevel;
    workspace: WorkspaceDTO;
    timeRange: TimeRange;
    sort?: { field: string; order: string }[];
    limit?: number;
    offset?: number;
    paginate?: boolean;
    filter?: { field: string; operator: string; value: string }[];
  }): Promise<any> {
    const { level = InsightsLevel.CAMPAIGNS, timeRange, limit, offset = 0, sort, filter, workspace } = options;
    if (!timeRange?.start || !timeRange?.end) {
      throw new HttpException(`TimeRange undefined`, HttpStatus.BAD_REQUEST);
    }
    let unionQuery = ``;
    unionQuery += `${level === InsightsLevel.CAMPAIGNS ? `${this.campaign(timeRange)}` : ''}`;
    unionQuery += `${level === InsightsLevel.AD_SETS ? `${this.adSet(timeRange)}` : ''}`;
    unionQuery += `${level === InsightsLevel.AD ? `${this.ad(timeRange)}` : ''}`;

    const resultFields = [
      ...['ad_account_id'],
      ...(level === InsightsLevel.CAMPAIGNS ? ['campaign_id'] : []),
      ...(level === InsightsLevel.AD_SETS ? ['campaign_id', 'ad_set_id'] : []),
      ...(level === InsightsLevel.AD ? ['campaign_id', 'ad_set_id', 'ad_id'] : []),
    ];
    const rawInsightsQuery = `select ${resultFields.join(
      ',',
    )}, max(result.insights)::json as insights from \n (${unionQuery}) as result\n group by ${resultFields.join(
      ',',
    )}\n`;

    let query = `select ${this.selection(level)} result.insights from (${rawInsightsQuery}) as result\n`;
    query += `LEFT JOIN ad_accounts on result.ad_account_id = ad_accounts.id\n`;
    query += `LEFT JOIN campaigns on result.campaign_id = campaigns.id\n`;
    query += `${level === InsightsLevel.AD_SETS ? `LEFT JOIN ad_sets on result.ad_set_id = ad_sets.id\n` : ''}`;
    query += `${
      level === InsightsLevel.AD
        ? `LEFT JOIN ad_sets on result.ad_set_id = ad_sets.id\nLEFT JOIN ads on result.ad_id = ads.id\n`
        : ''
    }`;

    query += `WHERE ad_accounts."workspaceId"='${workspace.id}'\n`;

    if (filter && filter.length > 0) {
      query += `${filter ? filter?.map((v) => this.mapFilter(level, v)).join('') : ''}`;
    }

    if (sort && sort?.length > 0) {
      query += `${this.sorting(level, sort)}`;
    }

    const totalQuery = `select count(*) from (${query}) as total`;

    if (!isNil(limit) && !isNil(offset)) {
      query += `limit ${limit} offset ${offset}`;
    }

    this.logger.log([`================\n`, query, `================\n`]);

    const promises = [
      getManager().query(`${query}`),
      getManager().query(totalQuery), // count total.campaign
    ];
    const [result, total] = await Promise.all(promises);
    return this.details(result, total[0].count, limit, offset);
  }

  sorting(level, sort) {
    const entityFields = ['name', 'status', 'createdAt', 'updatedAt', 'ad_sets_nr'];
    const metrics = [
      'spend',
      'impressions',
      'reach',
      'clicks',
      'results',
      'result_rate',
      'frequency',
      'unique_clicks',
      'cost_per_unique_click',
      'cpc',
      'cpm',
      'ctr',
      'cpa',
    ];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const field = sort[0];
    const getOrder = (field) => {
      let orderby = `order by `;
      const isEntity = entityFields.indexOf(field.field) !== -1;
      const isMetric = metrics.indexOf(field.field) !== -1;
      if (isEntity) {
        orderby += `${level === InsightsLevel.CAMPAIGNS ? `campaigns."${field.field}" ${field.order}\n` : ''}`;
        orderby += `${level === InsightsLevel.AD_SETS ? `ad_sets."${field.field}" ${field.order}\n` : ''}`;
        orderby += `${level === InsightsLevel.AD ? `ads."${field.field}" ${field.order}\n` : ''}`;
      }
      if (isMetric) {
        orderby += `CAST(CAST(result.insights as JSON)->'summary'->>'${field.field}' as numeric) ${field.order} NULLS LAST\n`;
      }
      if (!isMetric && !isEntity) {
        return '';
      }
      return orderby;
    };

    return getOrder(field);
  }

  details(data: any[], total: number, limit: number, offset: number) {
    return {
      data: data?.map((result) => ({
        ...result,
        ad_account_name: String(result?.ad_account?.name),
        currency: String(result?.ad_account?.currency),
        ...result?.campaign,
        ...result?.ad_set,
        ...result?.ad,
        ...getInsights(result),
      })),
      count: data.length,
      total: Number(total),
      page: limit ? Math.floor(offset / limit) + 1 : 1,
      pageCount: limit && total ? Math.ceil(total / limit) : 1,
    };
  }

  selection(level) {
    let selection = '';
    selection += `${this.insightsUtilService.jsonObject(ad_account_fields, 'ad_account')},\n`;
    selection += `${
      level === InsightsLevel.CAMPAIGNS ? `${this.insightsUtilService.jsonObject(campaign_fields, 'campaign')},\n` : ''
    }`;
    selection += `${
      level === InsightsLevel.AD_SETS
        ? `${this.insightsUtilService.jsonObject(campaign_fields, 'campaign')}\n,${this.insightsUtilService.jsonObject(
            ad_set_fields,
            'ad_set',
          )},\n`
        : ''
    }`;
    selection += `${
      level === InsightsLevel.AD
        ? `${this.insightsUtilService.jsonObject(campaign_fields, 'campaign')}\n, ${this.insightsUtilService.jsonObject(
            ad_set_fields,
            'ad_set',
          )}\n , ${this.insightsUtilService.jsonObject(ad_fields, 'ad')},\n`
        : ''
    }`;
    return selection;
  }

  campaign(timeRange) {
    const selection = `campaigns."adAccountId" as ad_account_id, campaigns.id as campaign_id`;
    let query = `SELECT ${selection}, null as insights from campaigns\n`;
    query += `GROUP BY campaigns."adAccountId", campaigns.id`;

    query += `\n UNION \n`;

    // facebook
    query += `SELECT ${selection}, \n ${this.insightsUtilService.jsonObject(
      {
        summary: `${this.insightsUtilService.jsonObject(this.insightsUtilService.facebookSumMetrics())}`,
      },
      'insights',
      '::text',
    )} from campaigns\n`;

    query += `LEFT JOIN facebook_insights ON facebook_insights.campaign_id=cast(campaigns."providerId" as numeric)\n`;
    query += `WHERE facebook_insights.breakdown='NONE'\n`;
    query += `AND facebook_insights.date BETWEEN CAST('${format(
      new Date(timeRange.start),
      'yyyy-MM-dd',
    )}' AS DATE) AND CAST('${format(new Date(timeRange.end), 'yyyy-MM-dd')}' AS DATE)\n`;
    query += `GROUP BY campaigns."adAccountId", campaigns.id`;

    query += `\n UNION \n`;

    // linkedin
    query += `SELECT ${selection}, \n ${this.insightsUtilService.jsonObject(
      {
        summary: `${this.insightsUtilService.jsonObject(this.insightsUtilService.linkedinSumMetrics())}`,
      },
      'insights',
      '::text',
    )} from campaigns\n`;

    query += `LEFT JOIN linkedin_insights ON linkedin_insights.campaign_id=cast(campaigns."providerId" as numeric)\n`;
    query += `WHERE linkedin_insights.breakdown='NONE'`;
    query += `AND linkedin_insights.date BETWEEN CAST('${format(
      new Date(timeRange.start),
      'yyyy-MM-dd',
    )}' AS DATE) AND CAST('${format(new Date(timeRange.end), 'yyyy-MM-dd')}' AS DATE)\n`;
    query += `GROUP BY campaigns."adAccountId", campaigns.id`;

    return query;
  }

  adSet(timeRange) {
    const selection = `ad_sets."adAccountId" as ad_account_id, ad_sets."campaignId" as campaign_id, ad_sets.id as ad_set_id`;
    let query = `SELECT ${selection}, null as insights from ad_sets\n`;
    query += `GROUP BY ad_sets."adAccountId", ad_sets."campaignId", ad_sets.id\n`;

    query += `\n UNION \n`;

    // facebook
    query += `SELECT ${selection}, \n ${this.insightsUtilService.jsonObject(
      {
        summary: `${this.insightsUtilService.jsonObject(this.insightsUtilService.facebookSumMetrics())}`,
      },
      'insights',
      '::text',
    )} from ad_sets\n`;

    query += `LEFT JOIN facebook_insights ON facebook_insights.adset_id=cast(ad_sets."providerId" as numeric)\n`;
    query += `WHERE facebook_insights.breakdown='NONE'\n`;
    query += `AND facebook_insights.date BETWEEN CAST('${format(
      new Date(timeRange.start),
      'yyyy-MM-dd',
    )}' AS DATE) AND CAST('${format(new Date(timeRange.end), 'yyyy-MM-dd')}' AS DATE)\n`;
    query += `GROUP BY ad_sets."adAccountId", ad_sets."campaignId", ad_sets.id\n`;
    return query;
  }

  ad(timeRange) {
    const selection = `ads."adAccountId" as ad_account_id, ads."campaignId" as campaign_id, ads."adSetId" as ad_set_id, ads.id as ad_id`;
    let query = `SELECT ${selection}, null as insights from ads\n`;
    query += `GROUP BY ads."adAccountId",ads."campaignId",ads."adSetId",ads.id`;

    query += `\n UNION \n`;

    // facebook
    query += `SELECT ${selection}, \n ${this.insightsUtilService.jsonObject(
      {
        summary: `${this.insightsUtilService.jsonObject(this.insightsUtilService.facebookSumMetrics())}`,
      },
      'insights',
      '::text',
    )} from ads\n`;

    query += `LEFT JOIN facebook_insights ON facebook_insights.ad_id=cast(ads."providerId" as numeric)\n`;
    query += `WHERE facebook_insights.breakdown='NONE'\n`;
    query += `AND facebook_insights.date BETWEEN CAST('${format(
      new Date(timeRange.start),
      'yyyy-MM-dd',
    )}' AS DATE) AND CAST('${format(new Date(timeRange.end), 'yyyy-MM-dd')}' AS DATE)\n`;
    query += `GROUP BY ads."adAccountId",ads."campaignId",ads."adSetId",ads.id`;

    query += `\n UNION \n`;

    // linkedin
    query += `SELECT ${selection}, \n ${this.insightsUtilService.jsonObject(
      {
        summary: `${this.insightsUtilService.jsonObject(this.insightsUtilService.linkedinSumMetrics())}`,
      },
      'insights',
      '::text',
    )} from ads\n`;

    query += `LEFT JOIN linkedin_insights ON linkedin_insights.ad_id=cast(ads."providerId" as numeric)\n`;
    query += `WHERE linkedin_insights.breakdown='NONE'`;
    query += `AND linkedin_insights.date BETWEEN CAST('${format(
      new Date(timeRange.start),
      'yyyy-MM-dd',
    )}' AS DATE) AND CAST('${format(new Date(timeRange.end), 'yyyy-MM-dd')}' AS DATE)\n`;
    query += `GROUP BY ads."adAccountId",ads."campaignId",ads."adSetId",ads.id`;

    return query;
  }

  fields(level): string[] {
    const campaigns_columns = ['campaigns.id'];
    const ad_sets_columns = ['ad_sets.id'];
    const ads_columns = ['ads.id'];
    const fields = [
      ...['ad_accounts.id'],
      ...(level === InsightsLevel.CAMPAIGNS ? campaigns_columns : []),
      ...(level === InsightsLevel.AD_SETS ? [...campaigns_columns, ...ad_sets_columns] : []),
      ...(level === InsightsLevel.AD ? [...campaigns_columns, ...ad_sets_columns, ...ads_columns] : []),
    ];
    return fields;
  }

  // eslint-disable-next-line max-len
  mapFilter(level, filter: { field: string; operator: string; value: any }): string {
    if (filter.operator[0] !== '$') {
      filter.operator = `$${filter.operator}`;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { field, operator, value } = filter;
    if (isNil(operator) || isNil(value)) {
      return '';
    }

    const levelFiled = {
      campaigns: 'campaigns',
      ad_sets: 'ad_sets',
      ads: 'ads',
    };
    const fields = {
      name: `${levelFiled[level]}.name ILIKE '%${value}%'`,
      provider:
        `${levelFiled[level]}.provider IN (${(Array.isArray(value) ? value : [value])
          ?.map((v) => `'${v}'`)
          .join(`,`)})` ?? '',
      'adAccount.id':
        `ad_accounts.id IN (${(Array.isArray(value) ? value : [value])?.map((v) => `'${v}'`).join(`,`)})` ?? '',
      status:
        `${levelFiled[level]}.status IN (${(Array.isArray(value) ? value : [value])
          ?.map((v) => `'${v}'`)
          .join(`,`)})` ?? '',
      'campaign.id':
        `campaigns.id IN (${(Array.isArray(value) ? value : [value])?.map((v) => `'${v}'`).join(`,`)})` ?? '',
      'adSet.id': `ad_sets.id IN (${(Array.isArray(value) ? value : [value])?.map((v) => `'${v}'`).join(`,`)})` ?? '',
    };

    const query = `${fields[field]}`;
    return `${query ? `and ${query} \n` : ''}`;
  }
}
