import { chunkTimeInMonthlyRange, concatTimeToDate } from './chunk-time-range';

describe('chunkTimeRange', () => {
  it('should chunk rage in 37', () => {
    const range = {
      start: new Date('2018-05-17'),
      end: new Date('2021-06-17'),
    };
    const ranges = chunkTimeInMonthlyRange(range);
    expect(ranges.length).toEqual(37);
    expect(ranges[0].start).toEqual(range.start);
    expect(ranges[ranges.length - 1].end).toEqual(range.end);
  });

  it('should chunk rage in 13', () => {
    const range = {
      start: new Date('2020-05-17'),
      end: new Date('2021-06-17'),
    };
    const ranges = chunkTimeInMonthlyRange(range);
    expect(ranges.length).toEqual(13);
    expect(ranges[0].start).toEqual(range.start);
    expect(ranges[ranges.length - 1].end).toEqual(range.end);
  });
  it('should chunk rage in 13', () => {
    const range = {
      start: new Date('2021-06-17'),
      end: new Date('2021-06-17'),
    };
    const ranges = chunkTimeInMonthlyRange(range);
    expect(ranges.length).toEqual(1);
    expect(ranges[0].start).toEqual(range.start);
    expect(ranges[ranges.length - 1].end).toEqual(range.end);
  });
  it('should chunk rage in 13', () => {
    const range = {
      start: new Date('2021-06-16'),
      end: new Date('2021-06-17'),
    };
    const ranges = chunkTimeInMonthlyRange(range);
    expect(ranges.length).toEqual(1);
    expect(ranges[0].start).toEqual(range.start);
    expect(ranges[ranges.length - 1].end).toEqual(range.end);
  });
  it('should chunk rage in 1', () => {
    const range = {
      start: new Date('2021-06-17'),
      end: new Date('2021-06-18'),
    };
    const ranges = chunkTimeInMonthlyRange(range);
    expect(ranges.length).toEqual(1);
    expect(ranges[0].start).toEqual(range.start);
    expect(ranges[ranges.length - 1].end).toEqual(range.end);
  });

  it('should throw error', () => {
    const range = {
      end: new Date('2019-06-17'),
      start: new Date('2020-05-17'),
    };
    try {
      chunkTimeInMonthlyRange(range);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('concatTimeToDate should return null ', () => {
    expect(concatTimeToDate(null, null)).toEqual(null);
  });

  it('concatTimeToDate should chunk the time', () => {
    expect(concatTimeToDate(new Date('1997-12-06'), '10:23').getTime()).toEqual(
      new Date('1997-12-06T10:23:00').getTime(),
    );
  });
});
