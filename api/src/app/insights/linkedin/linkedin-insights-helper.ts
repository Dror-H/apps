import { chunkTimeInMonthlyRange } from '../../shared/chunk-time-range';
import { LinkedinBreakdownType, TimeRange } from '@instigo-app/data-transfer-object';
import { isNumber } from 'lodash';
import { LinkedinInsightsEntity, LinkedinMetricEntity } from '../data/linkedin-insights.entity';
import { Element, URN } from './model.linkedin';
import { v5 as uuidv5 } from 'uuid';
import { format } from 'date-fns';

export function buildCombinations(timeRange: TimeRange): { breakdown: LinkedinBreakdownType; timeRange: TimeRange }[] {
  const timeRanges = chunkTimeInMonthlyRange(timeRange);
  return Object.values(LinkedinBreakdownType)
    .flatMap((breakdown: LinkedinBreakdownType) =>
      timeRanges.map((range) => [breakdown, range] as [LinkedinBreakdownType, TimeRange]),
    )
    .reduce((acc, current: [LinkedinBreakdownType, TimeRange]) => {
      const [breakdown, chunkTime] = current;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return [...acc, { breakdown: breakdown, timeRange: chunkTime }];
    }, []);
}

export function mapElements(options: {
  elements: Element[];
  adAccountId: number;
  campaignId: number;
  adId?: number;
  breakdown: LinkedinBreakdownType;
}): LinkedinInsightsEntity[] {
  const { adAccountId, campaignId, adId = 0, elements, breakdown } = options;
  return elements.map((element: Element) => {
    const range = element?.dateRange?.start;
    const mapped = {
      id: '',
      adAccountId: adAccountId,
      campaignId: campaignId,
      adId: adId,
      date: new Date(`${range?.year}-${range?.month}-${range?.day}`) || null,
      breakdown: breakdown,
      metric: metrics({ data: element }),
      country: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      region: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      industry: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      seniority: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      jobTitle: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      jobFunction: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      company: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
      companySize: value({ breakdown, pivotValue: element.pivotValue, projection: element['pivotValue~'] as unknown }),
    };
    const byteString = `
        ${mapped.adAccountId},
        ${mapped.campaignId},
        ${mapped.adId},
        ${format(new Date(mapped.date), 'yyyy-MM-dd')},
        ${mapped.breakdown},
        ${mapped.country},
        ${mapped.region},
        ${mapped.industry},
        ${mapped.seniority},
        ${mapped.jobTitle},
        ${mapped.jobFunction},
        ${mapped.company},
        ${mapped.companySize}`
      .replace(/\s/gi, '')
      .toString();

    mapped.id = uuidv5(byteString, uuidv5.URL);
    return mapped;
  });
}

function metrics(options: { data: Element }): LinkedinMetricEntity {
  const { data } = options;
  const value = (value: number) => (isNumber(value) && Number.isFinite(value) ? Number(value.toFixed(3)) || 0 : 0);
  return {
    spend: value(Number(data?.costInLocalCurrency)),
    impressions: value(Number(data?.impressions)),
    reach: value(Number(data?.approximateUniqueImpressions)),
    clicks: value(Number(data?.clicks)),
    conversions: value(Number(data?.externalWebsiteConversions)),
    frequency: value(Number(data?.impressions / data?.approximateUniqueImpressions)),
    conversionsRate: value(Number(((data?.externalWebsiteConversions / data?.clicks) * 100).toFixed(4))),
    totalEngagements: value(Number(data?.totalEngagements)),
    otherEngagements: value(Number(data?.otherEngagements)),
    likes: value(Number(data?.likes)),
    comments: value(Number(data?.comments)),
    shares: value(Number(data?.shares)),
    follows: value(Number(data?.follows)),
  };
}

function value(options: { breakdown: LinkedinBreakdownType; pivotValue: URN | string; projection: any }): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { breakdown, pivotValue, projection } = options;
  const map = {
    [LinkedinBreakdownType.INDUSTRY]: projection?.name?.localized?.en_US as string,
    [LinkedinBreakdownType.SENIORITY]: projection?.name?.localized?.en_US as string,
    [LinkedinBreakdownType.JOB_TITLE]: projection?.name?.localized?.en_US as string,
    [LinkedinBreakdownType.JOB_FUNCTION]: projection?.name?.localized?.en_US as string,
    [LinkedinBreakdownType.COUNTRY]: projection?.defaultLocalizedName?.value as string,
    [LinkedinBreakdownType.REGION]: projection?.defaultLocalizedName?.value as string,
    [LinkedinBreakdownType.COMPANY]: projection?.localizedName as string,
    [LinkedinBreakdownType.COMPANY_SIZE]: pivotValue as string,
  };
  return map[breakdown] || 'NULL';
}
