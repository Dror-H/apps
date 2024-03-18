import { differenceInCalendarDays, subDays } from 'date-fns';
import { StartEndDate } from '@instigo-app/data-transfer-object';

export function setDateRangeToMaxLast90days(options: { dateRange: StartEndDate }): { dateRange: StartEndDate } {
  const { dateRange } = options;
  const diff = Math.abs(differenceInCalendarDays(new Date(dateRange.start), new Date(dateRange.end)));
  if (diff > 90) {
    dateRange.start = subDays(new Date(dateRange.end), 90);
  }
  return { dateRange };
}
