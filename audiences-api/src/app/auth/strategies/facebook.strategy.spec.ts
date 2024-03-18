import { Test } from '@nestjs/testing';
import { FacebookStrategy } from './facebook.strategy';

describe('FacebookStrategy Test suite', () => {
  let service: FacebookStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FacebookStrategy,
        { provide: 'AuthService', useValue: {} },
        {
          provide: 'FACEBOOK_STRATEGY_CONFIG',
          useValue: {
            clientID: `3421432432432`,
            clientSecret: `543543543543`,
            callbackURL: `https://localhost:3001/auth/facebook/callback`,
            profileFields: ['id', 'emails', 'name'],
            passReqToCallback: true,
          },
        },
      ],
    }).compile();

    service = module.get<FacebookStrategy>(FacebookStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getProfileEmail from facebook profile', () => {
    expect((service as any).getProfileEmail({ emails: [{ value: 'test' }] })).toBe('test');
  });

  it('should getProfileEmail improvised id', () => {
    expect((service as any).getProfileEmail({ id: '1', provider: 'facebook' })).toBe('1@facebook.com');
  });

  it('should getProfileUserName from profile name', () => {
    expect(
      (service as any).getProfileUserName({
        name: { givenName: 'given', familyName: 'family' },
        email: 'test@test.com',
      }),
    ).toBe('given family');
  });

  it('should getProfileUserName from email', () => {
    expect((service as any).getProfileUserName({ email: 'test@test.com' })).toBe('test');
  });

  it('should getProfilePicture', async () => {
    expect(
      await (service as any).getProfilePicture({
        profileUrl: 'test',
        id: '1',
        userName: 'given family',
        provider: 'facebook',
      }),
    ).toBe('https://eu.ui-avatars.com/api/?name=given family');
  });

  it('should getProfilePicture', async () => {
    expect(
      await (service as any).getProfilePicture({
        id: '3278437282186540',
        userName: 'given family',
        provider: 'facebook',
      }),
    ).toBeDefined();
  });
});
