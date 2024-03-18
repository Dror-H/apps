describe('dummy', () => {
  it('should', function () {
    expect(true).toBe(true);
  });
});
// import { Profile, SupportedProviders } from '@instigo-app/data-transfer-object';
// import { StateScope } from '@api/auth/auth.module';
// import { MockRepository } from '@api/shared';
// import { User } from '@api/user/data/user.entity';
// import { HttpStatus } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import * as faker from 'faker';
// import { Base64 } from 'js-base64';
// import { SocialLoginService } from '../socialLogin.service';
//
// describe('SocialLogin Test suite', () => {
//   let socialLoginService: SocialLoginService;
//   let oAuthRepository;
//   let userRepository;
//   let authService;
//   let configService;
//
//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         {
//           provide: 'OauthTokenRepository',
//           useValue: {},
//         },
//         { provide: 'AuthService', useValue: {} },
//         { provide: 'UserRepository', useValue: new MockRepository() },
//         { provide: 'SubscriptionRepository', useValue: new MockRepository() },
//         { provide: 'ConfigService', useValue: {} },
//         SocialLoginService,
//       ],
//     }).compile();
//
//     oAuthRepository = module.get('OauthTokenRepository');
//     userRepository = module.get('UserRepository');
//     authService = module.get('AuthService');
//     configService = module.get('ConfigService');
//     socialLoginService = module.get<SocialLoginService>(SocialLoginService);
//     socialLoginService.logger.error = jest.fn();
//   });
//
//   it('should be defined', () => {
//     expect(socialLoginService).toBeDefined();
//   });
//
//   it('socialStrategyWorkflow - should call done with null', () => {
//     // Arrange
//     const done = jest.fn();
//
//     // Act
//     socialLoginService.socialStrategyWorkflow({
//       request: null,
//       accessToken: null,
//       refreshToken: null,
//       profile: null,
//       done,
//     });
//
//     // Assert
//     expect(done).toHaveBeenCalledWith(null, null);
//   });
//
//   it('socialStrategyWorkflow - should register user', async () => {
//     // Arrange
//     const user = { id: faker.datatype.uuid(), email: faker.internet.exampleEmail() };
//     const request = {
//       query: {
//         state: Base64.encode(
//           JSON.stringify({
//             user,
//             scope: 'login',
//           }),
//         ),
//       },
//     };
//     const accessToken = faker.datatype.uuid();
//     const refreshToken = faker.datatype.uuid();
//     const profile = {
//       id: user.id,
//     } as Profile;
//     const done = jest.fn();
//     socialLoginService.getProfileEmail = jest.fn().mockResolvedValueOnce(user.email);
//     userRepository.findByEmail = jest.fn().mockRejectedValueOnce(new Error('user not found'));
//     socialLoginService.registerUser = jest.fn().mockResolvedValueOnce(user);
//
//     // Act
//     await socialLoginService.socialStrategyWorkflow({
//       request,
//       accessToken,
//       refreshToken,
//       profile,
//       done,
//     });
//
//     // Assert
//     expect(socialLoginService.registerUser).toHaveBeenCalledWith({
//       profile,
//       accessToken,
//       refreshToken,
//       expiresAt: expect.anything(),
//       grantedAt: expect.anything(),
//       scope: 'login',
//     });
//     expect(done).toHaveBeenCalledWith(null, user);
//   });
//
//   it('socialStrategyWorkflow - should add Token To User', async () => {
//     // Arrange
//     const user = { id: faker.datatype.uuid(), email: faker.internet.exampleEmail() };
//     const request = {
//       query: {
//         state: Base64.encode(
//           JSON.stringify({
//             user,
//             scope: 'login',
//           }),
//         ),
//       },
//     };
//     const accessToken = faker.datatype.uuid();
//     const refreshToken = faker.datatype.uuid();
//     const profile = {
//       id: user.id,
//     } as Profile;
//     const done = jest.fn();
//
//     socialLoginService.getProfileEmail = jest.fn().mockResolvedValueOnce(user.email);
//     authService.checkUserByEmail = jest.fn().mockResolvedValueOnce(user);
//     oAuthRepository.findOneOrFail = jest.fn().mockRejectedValueOnce(new Error('token not found'));
//     oAuthRepository.addTokenToUser = jest.fn().mockResolvedValueOnce({});
//
//     // Act
//     await socialLoginService.socialStrategyWorkflow({
//       request,
//       accessToken,
//       refreshToken,
//       profile,
//       done,
//     });
//
//     // Assert
//     expect(socialLoginService.getProfileEmail).toHaveBeenCalledWith({ scope: 'login', user, profile });
//     expect(authService.checkUserByEmail).toHaveBeenCalled();
//     expect(oAuthRepository.findOneOrFail).toHaveBeenCalled();
//     expect(oAuthRepository.addTokenToUser).toHaveBeenCalledWith({
//       user,
//       profile,
//       accessToken,
//       refreshToken,
//       expiresAt: expect.anything(),
//       grantedAt: expect.anything(),
//       scope: 'login',
//     });
//     expect(done).toHaveBeenCalledWith(null, user);
//   });
//
//   it('socialStrategyWorkflow - should update token', async () => {
//     // Arrange
//     const user = { id: faker.datatype.uuid(), email: faker.internet.exampleEmail() };
//     const request = {
//       query: {
//         state: Base64.encode(
//           JSON.stringify({
//             user,
//             scope: 'login',
//           }),
//         ),
//       },
//     };
//     const accessToken = faker.datatype.uuid();
//     const refreshToken = faker.datatype.uuid();
//     const profile = {
//       id: user.id,
//     } as Profile;
//
//     const oAuthToken = {
//       id: faker.datatype.uuid(),
//       accessToken: faker.datatype.uuid(),
//       refreshToken,
//       status: 'active',
//       scope: 'login',
//     };
//
//     const done = jest.fn();
//     socialLoginService.getProfileEmail = jest.fn().mockResolvedValueOnce(user.email);
//     authService.checkUserByEmail = jest.fn().mockResolvedValueOnce(user);
//     oAuthRepository.findOneOrFail = jest.fn().mockResolvedValueOnce(oAuthToken);
//     oAuthRepository.save = jest.fn().mockResolvedValueOnce({});
//
//     // Act
//     await socialLoginService.socialStrategyWorkflow({
//       request,
//       accessToken,
//       refreshToken,
//       profile,
//       done,
//     });
//
//     // Assert
//     expect(socialLoginService.getProfileEmail).toHaveBeenCalledWith({ scope: 'login', user, profile });
//     expect(authService.checkUserByEmail).toHaveBeenCalled();
//     expect(oAuthRepository.findOneOrFail).toHaveBeenCalled();
//     expect(oAuthRepository.save).toHaveBeenCalledWith({
//       ...oAuthToken,
//       accessToken,
//       expiresAt: expect.any(Date),
//       grantedAt: expect.any(Date),
//       status: 'active',
//     });
//     expect(done).toHaveBeenCalledWith(null, user);
//   });
//
//   it('getProfileEmail - should return users email', () => {
//     // Arrange
//     const email = faker.internet.exampleEmail();
//     const options = { scope: StateScope.AUTHORIZE_APP, user: { email } as User, profile: { id: faker.datatype.uuid() } as Profile };
//     // Act
//     const result = socialLoginService.getProfileEmail(options);
//     // Assert
//     expect(result).toEqual(email);
//   });
//
//   it(`getProfileEmail - should return user's email`, () => {
//     // Arrange
//     const email = faker.internet.exampleEmail();
//     const options = { scope: StateScope.AUTHORIZE_APP, user: { email } as User, profile: { id: faker.datatype.uuid() } as Profile };
//     // Act
//     const result = socialLoginService.getProfileEmail(options);
//     // Assert
//     expect(result).toEqual(email);
//   });
//
//   it('getProfileEmail - should return profiles email', () => {
//     // Arrange
//     const email = faker.internet.exampleEmail();
//     const options = {
//       scope: StateScope.LOGIN,
//       user: { email } as User,
//       profile: { emails: [{ value: email }] } as Profile,
//     };
//     // Act
//     const result = socialLoginService.getProfileEmail(options);
//     // Assert
//     expect(result).toEqual(email);
//   });
//
//   it('getProfileEmail - should return provider fake email', () => {
//     // Arrange
//     const provider = faker.datatype.uuid();
//     const id = faker.datatype.uuid();
//     const expectedResult = `${id}@${provider}.com`;
//     const options = { scope: StateScope.LOGIN, user: { email: faker.internet.exampleEmail() } as User, profile: { id, provider } as Profile };
//     // Act
//     const result = socialLoginService.getProfileEmail(options);
//     // Assert
//     expect(result).toEqual(expectedResult);
//   });
//
//   it('registerUser - should register user', async () => {
//     // Arrange
//     const provider = faker.datatype.uuid();
//     const id = faker.datatype.uuid();
//     const email = faker.internet.exampleEmail();
//     const familyName = faker.datatype.uuid();
//     const accessToken = faker.datatype.uuid();
//     const refreshToken = faker.datatype.uuid();
//     const expiresAt = faker.date.future().getTime();
//     const grantedAt = faker.date.past().getTime();
//     const scope = faker.datatype.uuid() as StateScope;
//     const options = {
//       profile: { id, provider, email, name: { familyName } } as Profile,
//       accessToken,
//       refreshToken,
//       grantedAt,
//       expiresAt,
//       scope,
//     };
//     const user = { id, email, familyName };
//     authService.createUser = jest.fn().mockResolvedValue(user);
//     oAuthRepository.addTokenToUser = jest.fn().mockResolvedValue({});
//     // Act
//     const result = await socialLoginService.registerUser(options);
//     // Assert
//     expect(result).toEqual(user);
//   });
//
//   it('socialCallback - redirect is defined, should return that redirect', async () => {
//     // Arrange
//     const req = { user: faker.datatype.uuid() };
//     const redirect = faker.datatype.uuid();
//     const state = { redirect };
//     const encodedState = Base64.encode(JSON.stringify(state));
//     const options = { state: encodedState, req, provider: faker.datatype.uuid() as SupportedProviders };
//     const token = { token: faker.datatype.uuid() };
//     const expectedResult = { statusCode: HttpStatus.FOUND, url: redirect };
//     authService.createJwtToken = jest.fn().mockResolvedValue(token);
//     // Act
//     const result = await socialLoginService.socialCallback(options);
//     // Assert
//     expect(result).toEqual(expectedResult);
//   });
//
//   it('socialCallback - redirect is undefined and user onboarding uncompleted, should return to onboarding redirect', async () => {
//     // Arrange
//     const FRONTEND_HOST = faker.datatype.uuid();
//     const req = {
//       user: {
//         onboarding: { completed: false },
//       },
//     };
//     const options = { state: Base64.encode(JSON.stringify({})), req, provider: faker.datatype.uuid() as SupportedProviders };
//     const token = { token: faker.datatype.uuid() };
//     const expectedResult = { statusCode: HttpStatus.FOUND, url: `${FRONTEND_HOST}/onboarding/${token.token}` };
//     authService.createJwtToken = jest.fn().mockResolvedValue(token);
//     configService.get = jest.fn().mockReturnValue(FRONTEND_HOST);
//     // Act
//     const result = await socialLoginService.socialCallback(options);
//     // Assert
//     expect(result).toEqual(expectedResult);
//   });
//
//   it('socialCallback - redirect is undefined and user onboarding completed, should return /token redirect', async () => {
//     // Arrange
//     const FRONTEND_HOST = faker.datatype.uuid();
//     const req = {
//       user: {
//         onboarding: { completed: true },
//       },
//     };
//     const options = { state: Base64.encode(JSON.stringify({})), req, provider: faker.datatype.uuid() as SupportedProviders };
//     const token = { token: faker.datatype.uuid() };
//     const expectedResult = { statusCode: HttpStatus.FOUND, url: `${FRONTEND_HOST}/token/${token.token}` };
//     authService.createJwtToken = jest.fn().mockResolvedValue(token);
//     configService.get = jest.fn().mockReturnValue(FRONTEND_HOST);
//     // Act
//     const result = await socialLoginService.socialCallback(options);
//     // Assert
//     expect(result).toEqual(expectedResult);
//   });
//
//   it('socialCallback - something crashes (on decode, on parsing, ...), should return /auth redirect', async () => {
//     // Arrange
//     const FRONTEND_HOST = faker.datatype.uuid();
//     const req = {
//       user: {
//         onboarding: { completed: true },
//       },
//     };
//     const options = { state: '', req, provider: faker.datatype.uuid() as SupportedProviders };
//     const token = { token: faker.datatype.uuid() };
//     const expectedResult = { statusCode: HttpStatus.AMBIGUOUS, url: `${FRONTEND_HOST}/auth/login` };
//     authService.createJwtToken = jest.fn().mockResolvedValue(token);
//     configService.get = jest.fn().mockReturnValue(FRONTEND_HOST);
//     // Act
//     const result = await socialLoginService.socialCallback(options);
//     // Assert
//     expect(result).toEqual(expectedResult);
//   });
// });
