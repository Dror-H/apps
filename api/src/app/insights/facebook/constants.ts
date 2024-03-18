import { FacebookBreakdownType, TimeRange } from '@instigo-app/data-transfer-object';
import { chunkTimeInMonthlyRange } from '../../shared/chunk-time-range';

export interface FacebookCombination {
  breakdown: FacebookBreakdownType;
  timeRange: TimeRange;
}
export interface ScheduleJobArgs {
  accessToken: string;
  adAccountProviderId: string;
  breakdown: FacebookBreakdownType;
  timeRange: TimeRange;
}

export const breakdownTypes = {
  [FacebookBreakdownType.NONE]: null,
  [FacebookBreakdownType.AGE_AND_GENDER]: ['age', 'gender'],
  [FacebookBreakdownType.COUNTRY_AND_REGION]: ['country', 'region'],
  [FacebookBreakdownType.PUBLISHER_AND_POSITION]: ['publisher_platform', 'platform_position'],
  [FacebookBreakdownType.DEVICE]: ['device_platform'],
  [FacebookBreakdownType.HOURLY]: ['hourly_stats_aggregated_by_audience_time_zone'],
};

export function buildCombinations(timeRange): FacebookCombination[] {
  const timeRanges = chunkTimeInMonthlyRange(timeRange);
  return Object.values(FacebookBreakdownType)
    .flatMap((breakdown) => timeRanges.map((range) => [breakdown, range]))
    .reduce((acc, current) => {
      const [breakdown, chunkTime] = current;
      return [...acc, { breakdown, timeRange: chunkTime }];
    }, []) as FacebookCombination[];
}
