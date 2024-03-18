import {
  InstigoNotification,
  NotificationCodes,
  NotificationSupportedProviders,
  NotificationType,
  WORKSPACE_NOTIFICATION_EVENT,
  WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyAuthApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../data/user.entity';

@Injectable()
export class InspectUserAccountService {
  private readonly logger = new Logger(InspectUserAccountService.name);

  @Inject(ThirdPartyAuthApiService)
  private readonly thirdPartyAuthApiService: ThirdPartyAuthApiService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async inspectUsersAccountStatus(): Promise<void> {
    const users = await this.userRepository.find({ relations: ['oAuthTokens', 'ownedWorkspace'] });
    this.logger.log(`Inspect ${users.length} users`);
    for (const user of users) {
      const tokensStatus = await this.getUserProviderStatus(user.oAuthTokens);
      const disableTokens = tokensStatus.filter((token) => token.status === 'DISABLED');
      this.notifyMembers(user, disableTokens);
    }
  }

  notifyMembers(user, disableTokens) {
    for (const token of disableTokens) {
      user.ownedWorkspace.forEach((workspace) => {
        const isMonday = new Date().getDay() === 1;
        if (isMonday) {
          this.eventEmitter.emit(
            WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL,
            new InstigoNotification({
              providerId: NotificationCodes.ACCOUNT_DISABLED,
              title: `Limited Functionality`,
              description: `
              The ${this.titleCase(token.token.provider)} account of the current workspace owner is restricted.
              You will be unable to publish new campaigns until the account is unblocked by ${this.titleCase(
                token.token.provider,
              )}`,
              provider: NotificationSupportedProviders.INSTIGO,
              type: NotificationType.ERROR,
              banner: true,
              workspace: workspace,
              template: 'limited-functionality',
              context: {
                name: user?.firstName || 'Rockstar',
                provider: this.titleCase(token.token.provider),
                workspace: workspace.name,
              },
            }),
          );
        }
        this.eventEmitter.emit(
          WORKSPACE_NOTIFICATION_EVENT,
          new InstigoNotification({
            providerId: NotificationCodes.ACCOUNT_DISABLED,
            title: `Limited Functionality`,
            description: `
            The ${this.titleCase(token.token.provider)} account of the current workspace owner is restricted.
            You will be unable to publish new campaigns until the account is unblocked by ${this.titleCase(
              token.token.provider,
            )}`,
            provider: NotificationSupportedProviders.INSTIGO,
            type: NotificationType.ERROR,
            banner: true,
            workspace: workspace,
          }),
        );
      });
    }
  }

  async getUserProviderStatus(tokes: any[]) {
    return await Promise.all(
      tokes
        .filter((token) => token.scope === 'authorizeApp')
        .map(async (token) => {
          const status = await this.thirdPartyAuthApiService.getUserAccountStatus({
            provider: token.provider,
            accessToken: token.accessToken,
          });
          return { status, token };
        }),
    );
  }

  titleCase(value: string) {
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
  }
}
