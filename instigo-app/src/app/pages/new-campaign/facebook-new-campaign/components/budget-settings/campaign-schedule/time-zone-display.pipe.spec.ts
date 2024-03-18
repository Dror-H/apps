import { TimeZoneDisplayPipe } from './time-zone-display.pipe';

describe('TimeZoneDisplay PIPE', () => {
  it('create an instance', () => {
    const pipe = new TimeZoneDisplayPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return UTC(-08:00) when timezoneOffsetHoursUtc is -8', () => {
    const pipe = new TimeZoneDisplayPipe();
    expect(pipe.transform({ timezoneOffsetHoursUtc: '-08:00' } as any)).toBe('UTC(-08:00)');
  });

  it('should return UTC(00:00) when timezoneOffsetHoursUtc is -8', () => {
    const pipe = new TimeZoneDisplayPipe();
    expect(pipe.transform({} as any)).toBe('UTC(00:00)');
  });
});
