import { Test } from '@nestjs/testing';
import { MeService } from './me.service';

describe('MeService Test suite', () => {
  let service: MeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MeService,
        {
          provide: 'ThirdPartyAuthApiService',
          useValue: {},
        },
        {
          provide: 'PrismaService',
          useValue: {},
        },
        {
          provide: 'CustomerService',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MeService>(MeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
