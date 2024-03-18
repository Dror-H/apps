import { MockRepository } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';

describe('WorkspaceService Test suite', () => {
  let Service: WorkspaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        { provide: 'UserService', useValue: {} },
        { provide: 'WorkspaceRepository', useValue: new MockRepository() },
        { provide: 'MailerService', useValue: { sendMail: jest.fn().mockResolvedValue({}) } },
      ],
    }).compile();

    Service = module.get<WorkspaceService>(WorkspaceService);
  });

  it('should be defined', () => {
    expect(Service).toBeDefined();
  });
});
