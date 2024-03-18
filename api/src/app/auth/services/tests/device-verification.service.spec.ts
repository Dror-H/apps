import { UserDeviceMetadataRepository } from '@api/user/data/user-device-metadata.repository';
import { userMock } from '@instigo-app/api-shared';
import { Test } from '@nestjs/testing';
import { EventEmitter2 } from 'eventemitter2';
import { DeviceVerificationService } from '../device-verification.service';
import * as faker from 'faker';
describe('DeviceVerificationService Test suite', () => {
  let service: DeviceVerificationService;
  let mailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeviceVerificationService,
        { provide: EventEmitter2, useValue: {} },
        { provide: UserDeviceMetadataRepository, useValue: {} },
        { provide: 'MailerService', useValue: {} },
      ],
    }).compile();
    mailerService = module.get('MailerService');
    service = module.get<DeviceVerificationService>(DeviceVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created', () => {
    const user = userMock();
    user.email = 'Douglas.Farrell@gmail.com';
    user.fullName = 'Hipolito,Gerhold';
    const unknownIp = '233.201.170.95';
    const mail = service.emailBody({ user, unknownIp });
    expect(mail).toMatchSnapshot();
  });

  it('should not crash sent', async () => {
    const user = userMock();
    const unknownIp = faker.internet.ip();
    mailerService.sendMail = jest.fn().mockRejectedValue({});
    await expect(service.notifyUserByEmail({ user, unknownIp })).resolves.toBeUndefined();
  });
});
