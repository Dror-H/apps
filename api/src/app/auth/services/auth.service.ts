import { User } from '@api/user/data/user.entity';
import { UserRepository } from '@api/user/data/user.repository';
import { EmailNotVerifiedException, InvalidEmailFormatException } from '@instigo-app/api-shared';
import { SupportedProviders, TokenIntrospectionDto, TokenRefreshDto } from '@instigo-app/data-transfer-object';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { format } from 'date-fns';
import { InvalidTokenError } from 'jwt-decode';
import isEmail from 'validator/lib/isEmail';
import { passwordsAreEqual } from './passwordsAreEqual';

@Injectable()
export class AuthService {
  readonly logger = new Logger(AuthService.name);

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  constructor(
    @Inject(forwardRef(() => ThirdPartyAuthApiService))
    private thirdPartyAuthApiService: ThirdPartyAuthApiService,
  ) {}

  async validateUser(options: { email: string; password: string }): Promise<User> {
    const { email, password } = options;
    const user = await this.checkUserByEmail(email);
    if (user && (await passwordsAreEqual({ hashedPassword: user.password, plainPassword: password }))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async checkUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail({ email });
    return this.userRepository.save({ ...user });
  }

  async signUp(user: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const { email } = user;
    if (!isEmail(email)) {
      throw new InvalidEmailFormatException();
    }
    await this.userRepository.assertEmail({ email });
    return this.createUser({ user });
  }

  public async createJwtToken(options: {
    user: Partial<User>;
    scope?: string;
    signOptions?: any;
  }): Promise<{ token: string }> {
    const { user, scope, signOptions } = options;
    const token: string = await this.jwtService.signAsync(
      {
        user: {
          id: user.id,
          firstName: user.firstName,
          onboarding: user.onboarding,
          email: user.email,
          roles: user.roles,
        },
        scope,
        createdAt: format(new Date(), 'PPpp'),
      },
      signOptions,
    );
    return {
      token,
    };
  }

  async verifyToken(options: { token: string; signOptions?: any }): Promise<any> {
    const { token } = options;
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new InvalidTokenError();
    }
  }

  public async createUser(options: {
    user: {
      email: string;
      password: string;
      username: string;
      firstName?: string;
      lastName?: string;
      pictureUrl?: string;
    };
  }): Promise<User> {
    const { user } = options;
    const userObject = await plainToClass(User, user).setPassword(user.password);
    const newUser = await this.userRepository.saveNewUser({ payload: { ...userObject, subscriptionStatus: true } });
    delete newUser.password;
    return newUser;
  }

  checkEmailVerification(user: { emailVerification: boolean }): void {
    if (!user.emailVerification) {
      throw new EmailNotVerifiedException();
    }
  }

  inspectToken(options: { provider: SupportedProviders; accessToken: string }): Promise<TokenIntrospectionDto> {
    return this.thirdPartyAuthApiService.inspectToken(options);
  }

  refreshToken(options: {
    provider: SupportedProviders;
    accessToken: string;
    refreshToken?: string;
  }): Promise<TokenRefreshDto> {
    return this.thirdPartyAuthApiService.refreshToken(options);
  }
}
