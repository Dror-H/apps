import { MockRepository } from '@instigo-app/api-shared';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as faker from 'faker';
import { PasswordService } from '../password.service';

describe('PasswordService', () => {
  let service: PasswordService;
  let mailerService: MailerService;
  let config: ConfigService;
  let userRepository: any;
  let authService: any;
  let prettyLinkService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PasswordService,
        { provide: 'ConfigService', useValue: {} },
        { provide: 'MailerService', useValue: {} },
        { provide: 'AuthService', useValue: {} },
        { provide: 'UserRepository', useValue: new MockRepository() },
        { provide: 'PrettyLinkService', useValue: {} },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    mailerService = module.get('MailerService');
    config = module.get('ConfigService');
    userRepository = module.get('UserRepository');
    authService = module.get('AuthService');
    prettyLinkService = module.get('PrettyLinkService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`sendResetPasswordMail - should throw error when the mail couldn't be sent`, async () => {
    const email = faker.datatype.uuid();
    const password = faker.datatype.uuid();
    const user = { email, password };
    const options = { user: { email } };
    mailerService.sendMail = jest.fn().mockRejectedValue({ rejected: ['rejectedMail'] });
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    config.get = jest.fn().mockReturnValue('support@email.com');
    prettyLinkService.passwordResetShortUrl = jest.fn().mockReturnValue({});
    // Assert
    await expect(service.sendResetPasswordMail(options)).rejects.toThrow(
      `Could not send reset password email: ${email}`,
    );
  });

  it(`sendResetPasswordMail - should throw error when user could't be found by emai`, async () => {
    const error = 'User Not found';
    userRepository.findByEmail = jest.fn().mockRejectedValue(() => {
      throw new Error(error);
    });
    // Assert
    await expect(service.sendResetPasswordMail({ user: { email: 'example@email.com' } })).rejects.toThrow(error);
  });

  it('sendResetPasswordMail - should send email', async () => {
    // Arrange
    const email = faker.datatype.uuid();
    const password = faker.datatype.uuid();
    const user = { email, password };
    const expectedResult = `Reset password email successfully sent: ${user.email}`;
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    service.buildMailerOptions = jest.fn().mockReturnValue({});
    mailerService.sendMail = jest.fn().mockResolvedValue({});
    // Act
    const result = await service.sendResetPasswordMail({ user });
    // Assert
    expect(mailerService.sendMail).toHaveBeenCalled();
    expect(result).toEqual({ message: expectedResult });
  });

  it('resetPassword - it should reset password', async () => {
    // Arrange
    const email = faker.datatype.uuid();
    const options = { email, password: faker.datatype.uuid() };
    const expectedResult = { email, password: faker.datatype.uuid() };
    userRepository.findByEmail = jest.fn().mockResolvedValue(options);
    userRepository.save = jest.fn().mockResolvedValue(expectedResult);
    // Act
    const user = await service.resetPassword(options);
    // Assert
    expect(user).toEqual(expectedResult);
  });

  it('resetPassword - it should fail, email not found', async () => {
    // Arrange
    const email = faker.datatype.uuid();
    const options = { email, password: faker.datatype.uuid() };
    const error = 'User Not found';
    userRepository.findByEmail = jest.fn().mockRejectedValue(() => {
      throw new Error(error);
    });
    // Act and Assert
    await expect(service.resetPassword(options)).rejects.toThrow(error);
  });

  it('buildMailerOptions - should create mailer options', async () => {
    // Arrange
    const email = 'lupu60@gmail.com';
    const token = 'dasndsadknsan32321321';
    const username = 'lupu60';
    const from = 'moish@insticore.com';
    const BACKEND_HOST = 'http://instigo.api.io';
    const shortUrl = 'https://shorturl.at/bhiY4';

    config.get = jest.fn().mockReturnValueOnce(from).mockReturnValueOnce(BACKEND_HOST);
    prettyLinkService.passwordResetShortUrl = jest.fn().mockReturnValueOnce(shortUrl);
    const result = await service.buildMailerOptions({ userEmail: email, token, name: username });
    // Assert
    expect(result).toMatchSnapshot();
  });

  it('verifyResetPasswordToken - should return new token', async () => {
    // Arrange
    const expectedResult = faker.datatype.uuid();
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNTQzZjcxOTctM2VhMS00YmM5LWEwNjQtYTdjYThmMGYyYmY1IiwidXNlcm5hbWUiOm51bGwsImZpcnN0TmFtZSI6bnVsbCwibGFzdE5hbWUiOm51bGwsImVtYWlsIjoiZHJhZ29pdXJhdWwyMDA5QGdtYWlsLmNvbSIsImlzQWN0aXZlIjp0cnVlLCJwYXNzd29yZCI6IiQyYSQxMCQ4cGtuTmlpRlQ1TE0uVXlNTEJPeGN1MjdRQk5QWVp1TW81SUZjZWZ3S09Od0NiM3ZYQUZ2aSIsImNyZWF0ZWRBdCI6IjIwMjAtMDMtMThUMTQ6NTg6MDAuODk1WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDMtMThUMTg6MzA6MzUuODIzWiIsImVtYWlsVmVyaWZpY2F0aW9uIjpmYWxzZSwib25ib2FyZGluZyI6e30sInJvbGVzIjpbIlVTRVIiXX0sInNjb3BlIjoicmVzZXRQYXNzd29yZEVtYWlsIiwiaWF0IjoxNTg0NjIwNDA4fQ.BcuXi7Q6QYJKjPMeTVotE97ym1K5t4Auz2WN532ygsw`;
    const options = { token };
    const email = 'dragoiuraul2009@gmail.com';
    const password = '$2a$10$8pknNiiFT5LM.UyMLBOxcu27QBNPYZuMo5IFcefwKONwCb3vXAFvi';
    const user = { email, password };
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    authService.createJwtToken = jest.fn().mockResolvedValue({ token: expectedResult });
    // Act
    const result = await service.verifyResetPasswordToken(options);
    // Assert
    expect(result).toEqual({ token: expectedResult });
  });

  it('verifyResetPasswordToken - should throw JsonWebTokenError when password is changed ', async () => {
    // Arrange
    const expectedResult = faker.datatype.uuid();
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNTQzZjcxOTctM2VhMS00YmM5LWEwNjQtYTdjYThmMGYyYmY1IiwidXNlcm5hbWUiOm51bGwsImZpcnN0TmFtZSI6bnVsbCwibGFzdE5hbWUiOm51bGwsImVtYWlsIjoiZHJhZ29pdXJhdWwyMDA5QGdtYWlsLmNvbSIsImlzQWN0aXZlIjp0cnVlLCJwYXNzd29yZCI6IiQyYSQxMCQ4cGtuTmlpRlQ1TE0uVXlNTEJPeGN1MjdRQk5QWVp1TW81SUZjZWZ3S09Od0NiM3ZYQUZ2aSIsImNyZWF0ZWRBdCI6IjIwMjAtMDMtMThUMTQ6NTg6MDAuODk1WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDMtMThUMTg6MzA6MzUuODIzWiIsImVtYWlsVmVyaWZpY2F0aW9uIjpmYWxzZSwib25ib2FyZGluZyI6e30sInJvbGVzIjpbIlVTRVIiXX0sInNjb3BlIjoicmVzZXRQYXNzd29yZEVtYWlsIiwiaWF0IjoxNTg0NjIwNDA4fQ.BcuXi7Q6QYJKjPMeTVotE97ym1K5t4Auz2WN532ygsw`;
    const options = { token };
    const email = 'dragoiuraul2009@gmail.com';
    const password = 'changed password';
    const user = { email, password };
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    authService.createJwtToken = jest.fn().mockResolvedValue({ token: expectedResult });
    // Act and Assert
    await expect(service.verifyResetPasswordToken(options)).rejects.toThrow('invalid signature');
  });
});
