import { ThirdPartyInsightsApiService } from '@instigo-app/third-party-connector';
import { Test } from '@nestjs/testing';
import { ResourceInsightsService } from './resource-insights.service';

describe('ResourceInsightsService Test suite', () => {
  let resourceInsightsService: ResourceInsightsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ResourceInsightsService, { provide: ThirdPartyInsightsApiService, useValue: {} }],
    }).compile();

    resourceInsightsService = module.get<ResourceInsightsService>(ResourceInsightsService);
  });

  it('should be defined', () => {
    expect(resourceInsightsService).toBeDefined();
  });
});
