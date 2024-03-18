import { Test } from '@nestjs/testing';
import { NotificationRepository } from './notification.repository';

describe('NotificationRepository Test suite', () => {
  let Service: NotificationRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [NotificationRepository],
    }).compile();

    Service = module.get<NotificationRepository>(NotificationRepository);
  });

  it('should be defined', () => {
    expect(Service).toBeDefined();
  });
});
