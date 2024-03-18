import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { UserSlackReportsService } from './user-slack-reports.service';
describe('UserSlackReportsService Test suite', () => {
  let service: UserSlackReportsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSlackReportsService,
        { provide: 'SlackNotificationService', useValue: {} },
        { provide: 'UserRepository', useValue: new MockRepository() },
        { provide: 'ConfigService', useValue: {} },
        { provide: 'Connection', useValue: {} },
      ],
    }).compile();

    service = module.get<UserSlackReportsService>(UserSlackReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
