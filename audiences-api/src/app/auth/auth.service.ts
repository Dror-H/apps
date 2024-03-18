import { InvalidEmailFormatException, UndefinedSocialProfileException } from '@instigo-app/api-shared';
import { Callback, User } from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { isEmail } from 'class-validator';
import { addDays, format } from 'date-fns';
import { isNil } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async jwtToken(options: { user: Partial<User> }): Promise<string> {
    const { user } = options;
    const token: string = await this.jwtService.signAsync({
      user,
      createdAt: format(new Date(), 'PPpp'),
    });
    return token;
  }

  async facebookStrategy(options: {
    request: any;
    accessToken: string;
    refreshToken: string;
    profile: any;
    done: Callback;
  }): Promise<Callback> {
    const { accessToken, profile, done } = options;
    if (isNil(profile) || !profile.id) {
      throw new UndefinedSocialProfileException();
    }
    const user = await this.prismaService.user.upsert({
      where: { email: profile.email },
      create: {
        email: profile.email,
        password: null,
        profilePicture: profile.profilePicture,
        name: profile.userName,
        firstName: profile.userName.split(' ')[0] || null,
        lastName: profile.userName.split(' ')[1] || null,
      },
      update: {
        profilePicture: profile.profilePicture,
        name: profile.userName,
        firstName: profile.userName.split(' ')[0] || null,
        lastName: profile.userName.split(' ')[1] || null,
      },
      select: {
        password: false,
        email: true,
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    await this.prismaService.authToken.upsert({
      where: { providerClientId: profile.id },
      create: {
        user: { connect: { id: user.id } },
        accessToken,
        provider: 'facebook',
        providerClientId: profile.id,
        expiresAt: new Date(addDays(Date.now(), 60).getTime()),
      },
      update: { accessToken, expiresAt: new Date(addDays(Date.now(), 60).getTime()) },
    });

    this.saveTheUserInTheEmailList(user);

    return done(null, user);
  }

  async localStrategy(options: { email: string; password: string }): Promise<User> {
    const { email, password } = options;
    if (!isEmail(email)) {
      throw new InvalidEmailFormatException();
    }
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  public saveTheUserInTheEmailList(user: User): void {
    const data = JSON.stringify({
      email: user.email,
      attributes: {
        FIRSTNAME: user.firstName,
        LASTNAME: user.lastName,
        CREATED_AT: user.createdAt,
      },
      listIds: [parseInt(this.configService.get('SENDINBLUE_TARGET'), 10)],
      emailBlacklisted: false,
      smsBlacklisted: true,
      updateEnabled: false,
    });

    void this.httpService
      .post(this.configService.get('SENDINBLUE_URL'), data, {
        headers: {
          'api-key': this.configService.get('SENDINBLUE_KEY'),
          'Content-Type': 'application/json',
        },
      })
      .toPromise()
      .catch((err) => this.logger.error(err));
  }
}
