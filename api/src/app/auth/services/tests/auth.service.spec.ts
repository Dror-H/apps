import { SubscriptionService } from '@api/subscription/services/subscription.service';
import { User } from '@api/user/data/user.entity';
import { UserRepository } from '@api/user/data/user.repository';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import * as passwordsAreEqualFile from '../passwordsAreEqual';

describe('AuthService test suite', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let subscriptionService: SubscriptionService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ThirdPartyAuthApiService, useValue: {} },
        { provide: 'JwtService', useValue: {} },
        { provide: 'UserRepository', useValue: {} },
        { provide: 'SubscriptionService', useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get('UserRepository');
    subscriptionService = module.get('SubscriptionService');
    jwtService = module.get('JwtService');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('validateUser - should return user without password field', async () => {
    // Arrange
    const email = faker.internet.email();
    const password = faker.datatype.uuid();
    const id = faker.datatype.uuid();
    const options = { email, password };
    const user = { id, email, password };
    const expectedResult = { id, email };
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    jest.spyOn(passwordsAreEqualFile, 'passwordsAreEqual').mockReturnValue(Promise.resolve(true));
    authService.checkUserByEmail = jest.fn().mockResolvedValue(user);
    // Act
    const result = await authService.validateUser(options);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('validateUser - should return null when passwords not equals', async () => {
    // Arrange
    const email = faker.internet.email();
    const password = faker.datatype.uuid();
    const id = faker.datatype.uuid();
    const options = { email, password };
    const user = { id, email, password };
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    jest.spyOn(passwordsAreEqualFile, 'passwordsAreEqual').mockReturnValue(Promise.resolve(false));
    authService.checkUserByEmail = jest.fn().mockResolvedValue(user);

    // Act
    const result = await authService.validateUser(options);
    // Assert
    expect(result).toEqual(null);
  });

  it(`validateUser - should return null when user doesn't exist`, async () => {
    // Arrange
    const email = faker.internet.email();
    const password = faker.datatype.uuid();
    const options = { email, password };
    const user = undefined;
    userRepository.findByEmail = jest.fn().mockResolvedValue(user);
    jest.spyOn(passwordsAreEqualFile, 'passwordsAreEqual').mockReturnValue(Promise.resolve(true));
    authService.checkUserByEmail = jest.fn().mockResolvedValue(user);

    // Act
    const result = await authService.validateUser(options);
    // Assert
    expect(result).toEqual(null);
  });

  it('signUp - should create a user and return it', async () => {
    // Arrange
    const id = faker.datatype.uuid();
    const email = faker.internet.email();
    const password = faker.datatype.uuid();
    const user = { email, password, username: faker.datatype.uuid() };
    const expectedResult = { id, email, password };
    userRepository.assertEmail = jest.fn().mockResolvedValue({});
    authService.checkUserByEmail = jest.fn().mockResolvedValue(expectedResult);
    authService.createUser = jest.fn().mockResolvedValue(expectedResult);
    // Act
    const result = await authService.signUp(user);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('signUp - should throw error', () => {
    // Arrange
    const email = faker.internet.email();
    const password = faker.datatype.uuid();
    const user = { email, password, username: faker.datatype.uuid() };
    const error = 'User Not found';
    userRepository.assertEmail = jest.fn().mockRejectedValue(() => {
      throw new Error(error);
    });
    // Act and Assert
    void expect(authService.signUp(user)).rejects.toThrow(error);
  });

  it('createJwtToken - should return token', async () => {
    // Arrange
    const email = faker.internet.email();
    const id = faker.datatype.uuid();
    const onboarding = { completed: true };
    const scope = faker.datatype.uuid();
    const user = { id, email, onboarding };
    const signOptions = faker.datatype.uuid() as jwt.SignOptions;
    const options = { user, scope, signOptions };
    const token = faker.datatype.uuid();
    jwtService.signAsync = jest.fn().mockReturnValue(token);
    // Act
    const result = await authService.createJwtToken(options);
    // Assert
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        user: { id: user.id, onboarding: user.onboarding, email: user.email },
        scope,
        createdAt: expect.anything(),
      },
      signOptions,
    );
    expect(result).toEqual({ token });
  });

  it('verifyToken - should return verified token', async () => {
    // Arrange
    const token = faker.datatype.uuid();
    jwtService.verifyAsync = jest.fn().mockResolvedValue({});
    // Act
    await authService.verifyToken({ token });
    // Assert
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
  });

  it('verifyToken - should throw error', async () => {
    // Arrange
    const token = faker.datatype.uuid();
    jwtService.verifyAsync = jest.fn().mockRejectedValue({});
    // Act and Assert
    await expect(authService.verifyToken({ token })).rejects.toThrow();
  });

  it('createUser - should return new user', async () => {
    // Arrange
    const id = faker.datatype.uuid();
    const email = faker.internet.email();
    const password = faker.datatype.uuid();
    const username = faker.datatype.uuid();
    const user = { email, password, username };
    const createdUser = { id, email, username, password } as User;
    const expectedResult = { id, email, username };
    userRepository.saveNewUser = jest.fn().mockResolvedValue(createdUser);
    // Act
    const result = await authService.createUser({ user });
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
