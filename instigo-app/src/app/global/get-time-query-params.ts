import { StartEndDate } from '@instigo-app/data-transfer-object';
import { format } from 'date-fns';

export function getTimeQueryParams(options: { dateRange: StartEndDate }): string {
  const { dateRange } = options;

  return `time_range=${JSON.stringify({
    start: format(dateRange.start as Date, 'MM-dd-yyyy'),
    end: format(dateRange.end as Date, 'MM-dd-yyyy'),
  })}`;
}
