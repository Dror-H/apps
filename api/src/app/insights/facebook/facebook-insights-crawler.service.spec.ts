import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { FacebookInsightsCrawlerService } from './facebook-insights-crawler.service';
describe('FacebookInsightsCrawlerService Test suite', () => {
  let service: FacebookInsightsCrawlerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FacebookInsightsCrawlerService,
        { provide: 'FacebookApiService', useValue: {} },
        { provide: 'AdAccountRepository', useValue: new MockRepository() },
        { provide: 'InsightsAuditEntityRepository', useValue: new MockRepository() },
        { provide: 'FacebookInsightsEntityRepository', useValue: new MockRepository() },
        { provide: 'AdRepository', useValue: new MockRepository() },
      ],
    }).compile();

    service = module.get<FacebookInsightsCrawlerService>(FacebookInsightsCrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
