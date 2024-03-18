import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
describe('UserService Test suite', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'UserRepository', useValue: new MockRepository() },
        { provide: 'UserDeviceMetadataRepository', useValue: new MockRepository() },
        { provide: 'Connection', useValue: {} },
        { provide: 'WorkspaceService', useValue: {} },
        { provide: 'FileNestCrudService', useValue: {} },
        { provide: 'SubscriptionService', useValue: {} },
        { provide: 'ConfigService', useValue: {} },
        { provide: 'AdSpendService', useValue: { userAdSpend: jest.fn().mockResolvedValue({ total: 100 }) } },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
