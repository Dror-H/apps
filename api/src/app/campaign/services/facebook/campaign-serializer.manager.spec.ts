import { BudgetSettings } from '@instigo-app/data-transfer-object';
import { getConvertedTime } from './campaign-serializer.manager';

describe('campaign serializer functions', () => {
  describe('getConvertedTime', () => {
    it('should return converted startTime', () => {
      const budgetSettings = {
        range: {
          startDate: new Date('2021-07-03'),
          startTime: '11:00',
          endDate: new Date('2022-07-03'),
          endTime: '11:00',
        },
      } as BudgetSettings;
      const campaignSettings: any = { account: { timeZoneName: 'Europe/Vienna' } };

      const startTimeResult = getConvertedTime('start', budgetSettings, campaignSettings);
      expect(startTimeResult).toEqual(new Date('2021-07-03T11:00:00.000'));
      const endTimeResult = getConvertedTime('end', budgetSettings, campaignSettings);
      expect(endTimeResult).toEqual(new Date('2022-07-03T11:00:00.000'));
    });

    it('should return null if startTime or endTime is null', () => {
      const budgetSettings = {
        range: { startDate: null, startTime: '11:00', endDate: null, endTime: null },
      } as BudgetSettings;
      const campaignSettings: any = { account: { timeZoneName: 'Europe/Vienna' } };

      const startTimeResult = getConvertedTime('start', budgetSettings, campaignSettings);
      expect(startTimeResult).toBeNull();
      const endTimeResult = getConvertedTime('end', budgetSettings, campaignSettings);
      expect(endTimeResult).toBeNull();
    });
  });
});
