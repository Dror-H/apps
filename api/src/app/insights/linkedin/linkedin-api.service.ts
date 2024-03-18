import { sleep } from '@instigo-app/api-shared';
import { LinkedinBreakdownType, TimeRange } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { getDate, getMonth, getYear } from 'date-fns';
import { isEmpty } from 'lodash';
import { Element, Link, LinkedinResponse, Pivot } from './model.linkedin';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LinkedinApiService {
  private readonly logger = new Logger(LinkedinApiService.name);

  private headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  @Inject(HttpService)
  private readonly httpService: HttpService;

  defaultMetrics = [
    'externalWebsiteConversions',
    'dateRange',
    'impressions',
    'landingPageClicks',
    'likes',
    'shares',
    'costInLocalCurrency',
    'pivot',
    'pivotValue',
    'clicks',
    'approximateUniqueImpressions',
    'externalWebsiteConversions',
    'otherEngagements',
    'totalEngagements',
    'comments',
    'follows',
  ].join(',');

  timeRangeUri = (timeRange: TimeRange) =>
    `dateRange.start.year=${getYear(new Date(timeRange.start))}
  &dateRange.start.month=${getMonth(new Date(timeRange.start)) + 1}
  &dateRange.start.day=${getDate(new Date(timeRange.start))}
  &dateRange.end.year=${getYear(new Date(timeRange.end))}
  &dateRange.end.month=${getMonth(new Date(timeRange.end)) + 1}
  &dateRange.end.day=${getDate(new Date(timeRange.end))}`.replace(/\s/g, '');

  async insights(options: {
    accessToken: string;
    id: string;
    breakdown: LinkedinBreakdownType;
    timeRange: TimeRange;
    link?: string;
    attempts?: number;
  }): Promise<Element[]> {
    const { accessToken, id, breakdown, timeRange, attempts = 0 } = options;
    const buildUri = (ids: string[]) =>
      ids
        .reduce((acc, ad, index) => acc.concat(`creatives[${index}]=urn:li:sponsoredCreative:${ad}&`), '')
        .slice(0, -1);
    const params = [
      `pivot=${this.pivot(breakdown)}`,
      this.timeRangeUri(timeRange),
      buildUri([id]),
      `projection=(*,elements(*(*,pivotValue~(*))))`,
      `timeGranularity=DAILY`,
      `fields=${this.defaultMetrics}`,
    ];
    const path = options?.link ? options?.link : `/adAnalyticsV2?q=analytics&${params.join('&')}`;
    const url = `https://api.linkedin.com/v2${path.substr(0, 3) === '/v2' ? path.replace('/v2', '') : path}`;

    const [error, response] = await to(
      this.httpService
        .get<LinkedinResponse>(url, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
            ...this.headers,
          },
        })
        .toPromise(),
    );

    if (error) {
      const minutes = 1;
      this.logger.log(`Wait for ${minutes} minutes`);
      await sleep(minutes * 60 * 1001);
      if (attempts < 10) {
        return await this.insights({
          accessToken,
          id,
          breakdown,
          timeRange,
          link: options?.link,
          attempts: attempts + 1,
        });
      }
      throw new Error('Failed to parse');
    }

    const data = response?.data;

    if (!isEmpty(data?.paging?.links) && this.link(data)) {
      const nextElements = await this.insights({ accessToken, id, breakdown, timeRange, link: this.link(data) });
      await sleep(300);
      return [...data.elements, ...nextElements];
    }

    return data.elements;
  }

  link(data): string {
    return (data?.paging?.links as Link[])?.find((link) => link?.rel === 'next').href || undefined;
  }

  pivot(breakdown): Pivot {
    const map = {
      [LinkedinBreakdownType.NONE]: Pivot.CREATIVE,
      [LinkedinBreakdownType.INDUSTRY]: Pivot.MEMBER_INDUSTRY,
      [LinkedinBreakdownType.SENIORITY]: Pivot.MEMBER_SENIORITY,
      [LinkedinBreakdownType.JOB_TITLE]: Pivot.MEMBER_JOB_TITLE,
      [LinkedinBreakdownType.JOB_FUNCTION]: Pivot.MEMBER_JOB_FUNCTION,
      [LinkedinBreakdownType.COUNTRY]: Pivot.MEMBER_COUNTRY_V2,
      [LinkedinBreakdownType.REGION]: Pivot.MEMBER_REGION_V2,
      [LinkedinBreakdownType.COMPANY]: Pivot.MEMBER_COMPANY,
      [LinkedinBreakdownType.COMPANY_SIZE]: Pivot.MEMBER_COMPANY_SIZE,
    };
    return map[breakdown];
  }
}
