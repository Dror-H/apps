import { Test } from '@nestjs/testing';
import { InsightsTableService } from './insights-table.service';

describe('InsightsTable Test suite', () => {
  let service: InsightsTableService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InsightsTableService,
        { provide: 'ResourceInsightsService', useValue: {} },
        { provide: 'InsightsUtilService', useValue: {} },
      ],
    }).compile();

    service = module.get<InsightsTableService>(InsightsTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
