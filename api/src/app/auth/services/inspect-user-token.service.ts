import { User } from '@api/user/data/user.entity';
import {
  InstigoNotification,
  NotificationSupportedProviders,
  NotificationType,
  TokenStatus,
  WORKSPACE_NOTIFICATION_EVENT,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { fromUnixTime } from 'date-fns';
import { Repository } from 'typeorm';
import { OauthTokensAccesstoken } from '../data/oauth-tokens-accesstoken.entity';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class InspectUserTokenService {
  private readonly logger = new Logger(InspectUserTokenService.name);

  @Inject(ThirdPartyAuthApiService)
  private readonly thirdPartyAuthApiService: ThirdPartyAuthApiService;

  @InjectRepository(OauthTokensAccesstoken)
  private readonly oauthTokenRepository: Repository<OauthTokensAccesstoken>;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async refreshTokens() {
    const oauthTokens = await this.getTokens();
    const { results, errors } = await new PromisePool().for(oauthTokens).process(async (token) => {
      const refreshedToken = await this.thirdPartyAuthApiService.refreshToken({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        provider: token.provider as any,
      });
      this.logger.log(JSON.stringify(refreshedToken));
      if (refreshedToken && refreshedToken.accessToken !== token.accessToken) {
        await this.oauthTokenRepository.update(token.id, {
          status: TokenStatus.ACTIVE,
          accessToken: refreshedToken.accessToken,
          expiresAt: refreshedToken.expiresAt ? fromUnixTime(refreshedToken.expiresAt) : null,
          refreshTokenExpiresAt: refreshedToken.refreshTokenExpiresAt
            ? fromUnixTime(refreshedToken.refreshTokenExpiresAt)
            : null,
        });
      }
    });
    this.logger.log(`${results.length} tokens refreshed`);
    if (errors.length > 0) {
      this.logger.error(errors);
    }
  }

  async inspectUserToken() {
    const oauthTokens = await this.getTokens();
    const { results, errors } = await new PromisePool().for(oauthTokens).process(async (token) => {
      const tokenIntrospection = await this.thirdPartyAuthApiService.inspectToken({
        accessToken: token.accessToken,
        provider: token.provider as any,
      });
      if (tokenIntrospection.status !== TokenStatus.ACTIVE || token.status !== tokenIntrospection.status) {
        this.notifyMembers(token.user, token);
        await this.oauthTokenRepository.update(token.id, { status: tokenIntrospection.status });
      }
      return;
    });
    this.logger.log(`${results.length} tokens inspected`);
    if (errors.length > 0) {
      this.logger.error(errors);
    }
  }

  private async getTokens() {
    return await this.oauthTokenRepository
      .createQueryBuilder('oauth_tokens_accesstokens')
      .innerJoinAndSelect('oauth_tokens_accesstokens.user', 'user')
      .innerJoinAndSelect('user.ownedWorkspace', 'ownedWorkspace')
      .getMany();
  }

  private notifyMembers(user: User, oAuthToken: OauthTokensAccesstoken) {
    (user as any).ownedWorkspace.forEach((workspace) => {
      this.eventEmitter.emit(
        WORKSPACE_NOTIFICATION_EVENT,
        new InstigoNotification({
          title: `Workspace Owner need to re login on ${oAuthToken.provider}`,
          description: `Your are blocked from running campaigns on ${oAuthToken.provider}`,
          provider: NotificationSupportedProviders.INSTIGO,
          type: NotificationType.ERROR,
          banner: false,
          workspace: workspace,
        }),
      );
    });
  }
}
