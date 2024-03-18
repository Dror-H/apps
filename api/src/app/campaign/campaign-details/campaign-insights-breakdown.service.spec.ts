import { InsightsUtilService } from '@api/insights/services/insights-util.service';
import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { CampaignInsightsBreakdownService } from './campaign-insights-breakdown.service';
describe('CampaignInsightsBreakdownService Test suite', () => {
  let service: CampaignInsightsBreakdownService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: 'Connection', useValue: new MockRepository() },
        { provide: 'ResourceInsightsService', useValue: {} },
        InsightsUtilService,
        CampaignInsightsBreakdownService,
      ],
    }).compile();

    service = module.get<CampaignInsightsBreakdownService>(CampaignInsightsBreakdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
