import { Test } from '@nestjs/testing';
import * as faker from 'faker';
import { EmailVerificationService } from '../email-verification.service';

describe('EmailVerificationService test suite', () => {
  let emailService: EmailVerificationService;
  let userRepository;
  let authService;
  let configService;
  let mailerService;
  let prettyLinkService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailVerificationService,
        { provide: 'UserRepository', useValue: {} },
        { provide: 'ConfigService', useValue: {} },
        { provide: 'MailerService', useValue: {} },
        { provide: 'AuthService', useValue: {} },
        { provide: 'PrettyLinkService', useValue: {} },
      ],
    }).compile();

    emailService = module.get<EmailVerificationService>(EmailVerificationService);
    userRepository = module.get('UserRepository');
    authService = module.get('AuthService');
    configService = module.get('ConfigService');
    mailerService = module.get('MailerService');
    prettyLinkService = module.get('PrettyLinkService');
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  it('sendRegisterMail - should return success message', async () => {
    // Arrange
    const email = faker.datatype.uuid();
    const expectedResult = `Verification email successfully sent: ${email}`;
    const user = { email };
    const token = faker.datatype.uuid();

    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    authService.createJwtToken = jest.fn().mockResolvedValue({ token });
    emailService.buildMailerOptions = jest.fn().mockReturnValue({});
    mailerService.sendMail = jest.fn().mockResolvedValue({});
    // Act
    const result = await emailService.sendRegisterMail({ email });
    // Assert
    expect(mailerService.sendMail).toHaveBeenCalled();
    expect(result).toEqual({ message: expectedResult });
  });

  it('sendRegisterMail - should return error message', async () => {
    // Arrange
    const email = faker.datatype.uuid();
    const expectedResult = `Could not send verification email: ${email}`;
    const user = { email };
    const token = faker.datatype.uuid();

    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    authService.createJwtToken = jest.fn().mockResolvedValue({ token });
    emailService.buildMailerOptions = jest.fn().mockReturnValue({});
    mailerService.sendMail = jest.fn().mockRejectedValue({});
    // Act and Assert
    await expect(emailService.sendRegisterMail({ email })).rejects.toThrow(expectedResult);
  });

  it('confirmEmail - should update user and return it', async () => {
    // Arrange
    const token = faker.datatype.uuid();
    const email = faker.datatype.uuid();
    const user = { id: faker.datatype.uuid(), email, emailVerification: false };
    const expectedResult = { ...user, emailVerification: true };
    authService.verifyToken = jest.fn().mockResolvedValue({ user: { email } });
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    userRepository.save = jest.fn().mockResolvedValue(expectedResult);
    // Act
    const result = await emailService.confirmEmail({ token });
    // Assert
    expect(userRepository.save).toBeCalledWith(expectedResult);
    expect(result).toEqual(expectedResult);
  });

  it('confirmEmail - should throw error when when email is already verified', async () => {
    // Arrange
    const error = 'Email already verified!';
    const token = faker.datatype.uuid();
    const email = faker.datatype.uuid();
    const userToken = { email };
    const user = { email, emailVerification: true };
    authService.verifyToken = jest.fn().mockResolvedValue({ user: userToken });
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    // Act and Assert
    await expect(emailService.confirmEmail({ token })).rejects.toThrow(error);
  });

  it('buildMailerOptions - should create mailer options', async () => {
    // Arrange
    const email = 'lupu60@gmail.com';
    const token = 'dasndsadknsan32321321';
    const username = 'lupu60';

    configService.get = jest.fn().mockReturnValueOnce('http://instigo.api.io');
    prettyLinkService.emailVerificationShortUrl = jest.fn().mockReturnValueOnce('https://shorturl.at/bhiY4');
    // Act
    const result = await emailService.buildMailerOptions({ userEmail: email, token, name: username });
    // Assert
    expect(result).toMatchSnapshot();
  });
});
