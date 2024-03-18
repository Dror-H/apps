import { InsightsUtilService } from '@api/insights/services/insights-util.service';
import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { CampaignDetailsService } from './campaign-details.service';
describe('CampaignDetailsService Test suite', () => {
  let service: CampaignDetailsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: 'Connection', useValue: new MockRepository() },
        { provide: 'ResourceInsightsService', useValue: {} },
        InsightsUtilService,
        CampaignDetailsService,
      ],
    }).compile();

    service = module.get<CampaignDetailsService>(CampaignDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
