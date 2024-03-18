import { DatePresetLabels, DateRange } from '@instigo-app/data-transfer-object';

export function timeIntervalLabel(options: { datePreset: string; dateRange: DateRange }): string {
  const { datePreset, dateRange } = options;
  if (datePreset) {
    return DatePresetLabels[datePreset];
  }
  if (dateRange) {
    const { start, end } = dateRange;
    return `From ${start.day}/${start.month}/${start.year} to ${end.day}/${end.month}/${end.year}`;
  }
  return 'Unknown';
}
