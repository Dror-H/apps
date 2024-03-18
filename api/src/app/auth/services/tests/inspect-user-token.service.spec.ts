import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { InspectUserTokenService } from '../inspect-user-token.service';
describe(' Test suite', () => {
  let service: InspectUserTokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InspectUserTokenService,
        { provide: 'ThirdPartyAuthApiService', useValue: {} },
        { provide: 'OauthTokensAccesstokenRepository', useValue: new MockRepository() },
        { provide: 'EventEmitter', useValue: { emit: () => {} } },
      ],
    }).compile();

    service = module.get<InspectUserTokenService>(InspectUserTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
