import { TimeRange } from '@instigo-app/data-transfer-object';
import { subDays } from 'date-fns';
import add from 'date-fns/add';

export function getInitialLoadDateRange(): TimeRange {
  return {
    start: subDays(new Date(), 7),
    end: new Date(),
  };
}
export function convertDatePresetToDateRange(datePreset): TimeRange {
  return {
    start: datePreset.dateRange.start,
    end: add(datePreset.dateRange.end, { days: 1 }),
  };
}
