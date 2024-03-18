import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { InspectUserAccountService } from './inspect-user-account-status.service';
describe('InspectUserAccountService Test suite', () => {
  let service: InspectUserAccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InspectUserAccountService,
        { provide: 'ThirdPartyAuthApiService', useValue: {} },
        { provide: 'UserRepository', useValue: new MockRepository() },
        { provide: 'EventEmitter', useValue: { emit: () => {} } },
      ],
    }).compile();

    service = module.get<InspectUserAccountService>(InspectUserAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
