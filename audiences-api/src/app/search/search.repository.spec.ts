import { Test } from '@nestjs/testing';
import { SearchRepository } from './search.repository';

describe('SearchRepository Test suite', () => {
  let service: SearchRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchRepository,
        {
          provide: 'PrismaService',
          useValue: {
            facebookSegment: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        {
          provide: 'HttpService',
          useValue: {},
        },
        {
          provide: 'ConfigService',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SearchRepository>(SearchRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
