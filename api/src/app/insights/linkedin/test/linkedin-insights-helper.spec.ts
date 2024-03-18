import { LinkedinBreakdownType } from '@instigo-app/data-transfer-object';
import { mapElements } from '../linkedin-insights-helper';
import { testElements } from './data-test';
describe('Insights Helper', () => {
  it('should map element', () => {
    const insights = mapElements({
      elements: [testElements[0]] as any[],
      adAccountId: 423423,
      campaignId: 42352,
      adId: 432432432,
      breakdown: LinkedinBreakdownType.NONE,
    });
    expect(insights).toBeDefined();
  });
});
