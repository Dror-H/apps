import { User } from '@api/user/data/user.entity';
import { UserService } from '@api/user/services/user.service';
import { FailedToLoginException } from '@instigo-app/api-shared';
import { TokenStatus } from '@instigo-app/data-transfer-object';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import to from 'await-to-js';
import { format } from 'date-fns';
import { Repository } from 'typeorm';
import { StateScope } from '..';
import { OauthTokensAccesstoken } from '../data/oauth-tokens-accesstoken.entity';

@Injectable()
export class FacebookService {
  readonly logger = new Logger(FacebookService.name);

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(OauthTokensAccesstoken)
  private readonly oauthTokensAccesstokenRepository: Repository<OauthTokensAccesstoken>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(ConfigService)
  configService: ConfigService;

  parseSignedRequest(
    signedRequest,
    secret,
  ): {
    algorithm: string;
    expires: number;
    issued_at: number;
    user_id: string;
  } {
    const crypto = require('crypto');

    const base64decode = (data) => {
      while (data.length % 4 !== 0) {
        data += '=';
      }
      data = data.replace(/-/g, '+').replace(/_/g, '/');
      return new Buffer(data, 'base64').toString('utf-8');
    };

    const encoded_data = signedRequest.split('.', 2);
    // decode the data
    const sig = encoded_data[0];
    const json = base64decode(encoded_data[1]);
    const data = JSON.parse(json);
    if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
      throw Error(`Unknown algorithm: ${data.algorithm} . Expected HMAC-SHA256`);
    }
    const expected_sig = crypto
      .createHmac('sha256', secret)
      .update(encoded_data[1])
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace('=', '');
    if (sig !== expected_sig) {
      throw Error(`Invalid signature: ${sig} . Expected ${expected_sig}`);
    }
    return data;
  }

  async handleFacebookDataDeletion(options: { signedRequest; confirmationCode }) {
    const { signedRequest, confirmationCode = uuidv4() } = options;
    const data = this.parseSignedRequest(signedRequest, this.configService.get('FACEBOOK_APP_SECRET'));

    const [err, otoken] = await to(
      this.oauthTokensAccesstokenRepository.findOneOrFail({
        where: {
          providerClientId: data.user_id,
          provider: 'facebook',
        },
      }),
    );

    if (err || !otoken) {
      this.logger.error(err);
      throw new NotFoundException();
    }

    await this.userService.deleteAccount(otoken.user);

    return {
      url: `https://app.instigo.io/auth/check-deletion-status/${otoken.user.id}`,
      confirmation_code: confirmationCode,
    };
  }

  async checkDeletionStatus(userId: string) {
    const [err, user] = await to(this.userRepository.findOneOrFail(userId));
    if (err || !user) {
      this.logger.error(err);
      return 'user deleted';
    }
    return {
      status: 'in_progress',
      contact: 'contact@instigo.io',
      details: 'instigo.io',
    };
  }

  async handleFacebookLogin(options: {
    profile: {
      id: string;
      name: string;
      email: string;
    };
    auth: {
      accessToken: string;
      userID: string;
      expiresIn: number;
      signedRequest: string;
      graphDomain: string;
      data_access_expiration_time: number;
    };
  }) {
    const { profile, auth } = options;
    if (!profile.email) {
      throw new BadRequestException('Facebook login failed');
    }
    const [err, user] = await to(this.findOrCreateUser({ profile }));
    if (err || !user) {
      this.logger.error(err);
      throw new FailedToLoginException({ email: profile.email });
    }
    const [tokenErr, token] = await to(this.findOrCreateUserToken({ user, profile, auth }));
    if (tokenErr || !token) {
      this.logger.error(tokenErr);
      throw new FailedToLoginException({ email: profile.email });
    }

    const jwttoken: string = await this.jwtService.signAsync({
      user: {
        id: user.id,
        firstName: user.firstName,
        onboarding: user.onboarding,
        email: user.email,
        roles: user.roles,
      },
      createdAt: format(new Date(), 'PPpp'),
    });

    return { token: jwttoken, next: !user.onboarding.completed ? `/onboarding/${jwttoken}` : `/token/${jwttoken}` };
  }

  private async findOrCreateUserToken({ user, profile, auth }) {
    const [err, otoken] = await to(
      this.oauthTokensAccesstokenRepository.findOneOrFail({
        where: {
          user,
          providerClientId: profile.id,
          provider: 'facebook',
        },
      }),
    );
    if (err || !otoken || auth.accessToken !== otoken.accessToken) {
      const [creationErr, ntoken] = await to(
        this.oauthTokensAccesstokenRepository.save({
          ...otoken,
          user,
          scope: StateScope.LOGIN,
          status: TokenStatus.ACTIVE,
          accessToken: auth.accessToken,
          provider: 'facebook',
          providerClientId: profile.id,
        }),
      );
      if (creationErr) {
        this.logger.error(creationErr);
        return null;
      }
      return ntoken;
    }
    return otoken;
  }

  private async findOrCreateUser({ profile }) {
    const [err, user] = await to(this.userRepository.findOneOrFail({ where: { email: profile.email } }));
    if (err || !user) {
      this.logger.error(err);
      const [creationErr, user] = await to(
        this.userRepository.save({
          email: profile.email,
          name: profile.name,
          password: `facebookLOGIN${uuidv4()}`,
          pictureUrl: `https://eu.ui-avatars.com/api/?name=${profile.name}`,
          firstName: profile.name,
          lastName: profile.name,
        }),
      );
      if (creationErr) {
        this.logger.error(creationErr);
        return null;
      }
      return user;
    }
    return user;
  }
}
