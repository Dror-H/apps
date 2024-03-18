import { MockRepository, mockWorkspace } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HandleNotificationService } from './handle-notification.service';

describe('HandleNotificationService Test suite', () => {
  let service: HandleNotificationService;
  let notificationRepository: Repository<any>;
  let workspaceRepository: Repository<any>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HandleNotificationService,
        { provide: 'NotificationRepository', useValue: new MockRepository() },
        { provide: 'WorkspaceRepository', useValue: new MockRepository() },
        { provide: 'MailerService', useValue: { sendMail: jest.fn().mockResolvedValue({}) } },
      ],
    }).compile();

    service = module.get<HandleNotificationService>(HandleNotificationService);
    notificationRepository = module.get<Repository<any>>('NotificationRepository');
    workspaceRepository = module.get<Repository<any>>('WorkspaceRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a notification', async () => {
    const [workspace] = mockWorkspace({});
    const notification = {
      id: 'fdcb714c-d7b1-42b7-9357-cd3f8bf19515',
      updatedAt: '2021-09-06 13:22:08.797762+00',
      description: 'Your cost cap is at 80%',
      version: 4,
      provider: 'facebook',
      read: false,
      workspace,
      provider_id: '1778436623',
      type: 'error',
      title: 'Cost cap reached',
      banner: true,
      createdAt: '2021-08-17 10:02:02+00',
      adAccountId: '54b72cae-136b-4470-b1ec-fbc8340fec16',
    } as any;

    workspaceRepository.findOne = jest.fn().mockResolvedValue(workspace);
    const result = await service.handleNewWorkspaceNotification(notification);
    expect(result).toBeDefined();
    expect(result.length).toBe(5);
    expect(notificationRepository.createQueryBuilder).toBeCalled();
  });

  // should build a notification object
  it('should build a notification object', () => {
    const [workspace] = mockWorkspace({});
    const notification = {
      description: 'Your cost cap is at 80%',
      user: workspace.owner,
      read: false,
      workspace,
      type: 'error',
      title: 'Cost cap reached',
      banner: true,
    } as any;

    const mailerOptions = service.sendMailOptions({ notification });
    expect(mailerOptions).toBeDefined();
  });
});
