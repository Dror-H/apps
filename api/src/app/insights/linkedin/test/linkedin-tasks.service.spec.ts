import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { LinkedinInsightsCrawlerService } from '../linkedin-insights-crawler.service';
describe('Linkedin Tasks Test suite', () => {
  const range = {
    start: new Date('2020-06-17'),
    end: new Date('2021-06-18'),
  };
  let service: LinkedinInsightsCrawlerService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LinkedinInsightsCrawlerService,
        { provide: 'LinkedinApiService', useValue: {} },
        { provide: 'CampaignRepository', useValue: new MockRepository() },
        { provide: 'AdAccountRepository', useValue: new MockRepository() },
        { provide: 'AdRepository', useValue: new MockRepository() },
        { provide: 'LinkedinInsightsEntityRepository', useValue: new MockRepository() },
        { provide: 'InsightsAuditEntityRepository', useValue: new MockRepository() },
      ],
    }).compile();

    service = module.get<LinkedinInsightsCrawlerService>(LinkedinInsightsCrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('should get all linkedin ad-accounts');
  it.todo('should get all linkedin campaigns paginated of that ad-account');
});
