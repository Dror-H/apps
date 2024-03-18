import { TimeRange } from '@instigo-app/data-transfer-object';
import { addDays, addMonths, differenceInMonths, formatISO } from 'date-fns';

export function chunkTimeInMonthlyRange(timeRange: TimeRange) {
  if (!timeRange || timeRange.start > timeRange.end) {
    throw new Error('TimeRange Invalid');
  }
  const ranges: TimeRange[] = [];

  timeRange.start = new Date(formatISO(timeRange.start as Date, { representation: 'date' }));
  timeRange.end = new Date(formatISO(timeRange.end as Date, { representation: 'date' }));

  let start = addDays(timeRange.start, 1);

  const diff = Math.abs(differenceInMonths(timeRange.start, timeRange.end));

  if (diff === 0) {
    return [timeRange];
  }

  for (let i = 0; i < diff; i++) {
    ranges.push({ start, end: addMonths(start, 1) });
    start = addMonths(start, 1);
  }

  ranges[0].start = timeRange.start;
  ranges[ranges.length - 1].end = timeRange.end;
  return ranges;
}

export const concatTimeToDate = (date: Date, time: string): Date => {
  if (!date) {
    return null;
  }
  let timeSplit = time?.split(':');
  if (!timeSplit) {
    timeSplit = ['00', '00'];
  }
  const dateToReturn = new Date(date);
  dateToReturn.setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1]));
  return dateToReturn;
};
