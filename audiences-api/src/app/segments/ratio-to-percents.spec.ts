import {
  compensatePercentage,
  compensateTargetingRatio,
  computeRatioInPercents,
  getResultFromRatio,
  getTotal,
  ratioToPercents,
} from './ratio-to-percents.utils';

const testingData = [
  {
    segmentRatio: {
      behaviors: 3,
      interests: 14,
      work_employers: 2,
      work_positions: 11,
      education_majors: 3,
      education_statuses: 3,
    },
    total: 36,
  },
  { segmentRatio: { interests: 12, education_majors: 1, education_statuses: 1 }, total: 14 },
  { segmentRatio: { interests: 17 }, total: 17 },
  { segmentRatio: { interests: 10, work_employers: 5, work_positions: 3 }, total: 18 },
  { segmentRatio: { interests: 21 }, total: 21 },
  { segmentRatio: { interests: 9, work_positions: 17, education_majors: 1 }, total: 27 },
  { segmentRatio: { interests: 1, work_positions: 10 }, total: 11 },
  {
    segmentRatio: {
      behaviors: 1,
      interests: 49,
      industries: 13,
      work_employers: 4,
      work_positions: 90,
      education_statuses: 5,
    },
    total: 162,
  },
  { segmentRatio: { work_positions: 23 }, total: 23 },
  { segmentRatio: { interests: 3, education_statuses: 2 }, total: 5 },
  { segmentRatio: { interests: 39 }, total: 39 },
];
describe('ratio to percents', () => {
  it('should computeRatioInPercents', () => {
    testingData.forEach(({ segmentRatio, total }) => {
      const percentage = computeRatioInPercents(segmentRatio, total);
      const result = Object.values(percentage).reduce((acc: number, current: number) => (acc += current), 0);
      expect(result === 100 || result === 99.99 || result === 100.01).toBeTruthy();
    });
  });

  describe('ratioToPercents', () => {
    it('should ratioToPercents', () => {
      testingData.forEach(({ segmentRatio }) => {
        const result = ratioToPercents(segmentRatio);
        const total = Object.values(result).reduce((acc: number, current: number) => (acc += current), 0);
        expect(total).toEqual(100);
      });
    });

    it('should return targetingRatio with zero as values', () => {
      const segmentRatio = { interests: 0, work_employers: 0 };
      expect(ratioToPercents(segmentRatio)).toEqual({ interests: 0, demographics: 0, behaviors: 0 });
    });

    it('should compensatePercentage by adding 1 to interest', () => {
      const targetingRatio = { interests: 33, income: 33, behaviors: 33 };
      const result = ratioToPercents(targetingRatio);
      expect(result.interests).toBe(34);
    });
  });

  describe('getResultFromRatio', () => {
    it('should return 0 for all on empty object', () => {
      expect(getResultFromRatio({})).toEqual({ interests: 0, demographics: 0, behaviors: 0 });
    });

    it('should correctly set percentages to their groups', () => {
      const targetingRatio = { industries: 80.44, income: 6.56, connections: 13 };
      const expectedResult = { interests: 0, demographics: 87, behaviors: 13 };
      expect(getResultFromRatio(targetingRatio)).toEqual(expectedResult);
    });
  });

  it('should getTotal', () => {
    const targetingRatio = { interests: 33, demographics: 33, behaviors: 33 };
    expect(getTotal(targetingRatio)).toBe(99);
  });

  describe('compensatePercentage', () => {
    it('should compensatePercentage by adding 1 to interest', () => {
      const targetingRatio = { interests: 33, demographics: 33, behaviors: 33 };
      compensatePercentage(99, targetingRatio);
      expect(targetingRatio.interests).toBe(34);
    });

    it('should compensatePercentage by reducing 1 from interest', () => {
      const targetingRatio = { interests: 35, demographics: 33, behaviors: 33 };
      compensatePercentage(101, targetingRatio);
      expect(targetingRatio.interests).toBe(34);
    });
  });

  describe('compensateTargetingRatio', () => {
    it('should compensate targeting by reducing 1 from interest', () => {
      const targetingRatio = { interests: 35, demographics: 33, behaviors: 33 };
      compensateTargetingRatio(targetingRatio);
      expect(targetingRatio.interests).toBe(34);
    });

    it('should compensate targeting by reducing 6 from interest', () => {
      const targetingRatio = { interests: 40, demographics: 33, behaviors: 33 };
      compensateTargetingRatio(targetingRatio);
      expect(targetingRatio.interests).toBe(34);
    });

    it('should compensate targeting by reducing 5 from demographics', () => {
      const targetingRatio = { interests: 0, demographics: 55, behaviors: 50 };
      compensateTargetingRatio(targetingRatio);
      expect(targetingRatio).toEqual({ interests: 0, demographics: 50, behaviors: 50 });
    });

    it('should throw exceeded maximum of 10 (default) compensations error', () => {
      const targetingRatio = { interests: 0, demographics: 60, behaviors: 50 };
      expect(() => compensateTargetingRatio(targetingRatio)).toThrowError('Exceeded maximum of 10 compensations');
    });

    it('should throw exceeded maximum of 5 compensations error', () => {
      const targetingRatio = { interests: 0, demographics: 55, behaviors: 50 };
      expect(() => compensateTargetingRatio(targetingRatio, 5)).toThrowError('Exceeded maximum of 5 compensations');
    });
  });
});
