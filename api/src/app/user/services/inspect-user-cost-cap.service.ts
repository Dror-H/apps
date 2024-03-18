import { AdSpendService } from '@api/insights/services/ad-spend.service';
import { SubscriptionService } from '@api/subscription/services/subscription.service';
import {
  InstigoNotification,
  NotificationCodes,
  NotificationSupportedProviders,
  NotificationType,
  WORKSPACE_NOTIFICATION_EVENT,
  WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL,
} from '@instigo-app/data-transfer-object';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../data/user.entity';

@Injectable()
export class InspectUserCostCapService {
  private readonly logger = new Logger(InspectUserCostCapService.name);

  @Inject(AdSpendService)
  private readonly adSpendService: AdSpendService;

  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async inspectCostCap(): Promise<void> {
    const users = await this.userRepository.find({ relations: ['ownedWorkspace'] });
    this.logger.log(`Inspect ${users.length} users`);
    for (const user of users) {
      const { total: spend } = await this.adSpendService.userAdSpend({ user });
      const { data: subscription } = await this.subscriptionService.getSubscription({ user });
      if (spend > (subscription?.spendCap || 1) * 1000) {
        this.notifyMembers(user);
        await this.upgradeUserSubscription({ user, subscription });
      }
    }
  }

  async upgradeUserSubscription({ user, subscription }) {
    try {
      if (subscription) {
        await this.subscriptionService.updateSubscription({
          user,
          price: subscription.price,
          quantity: Number(subscription.quantity) + 1,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  notifyMembers(user) {
    user.ownedWorkspace.forEach((workspace) => {
      const isMonday = new Date().getDay() === 1;
      if (isMonday) {
        this.eventEmitter.emit(
          WORKSPACE_NOTIFICATION_EVENT_AND_EMAIL,
          new InstigoNotification({
            providerId: NotificationCodes.COST_CAP_REACH,
            title: `Workspace Owner account has reached the limit cost cap`,
            description: `Workspace Owner account has reached the limit cost cap`,
            provider: NotificationSupportedProviders.INSTIGO,
            type: NotificationType.ERROR,
            banner: true,
            workspace: workspace,
          }),
        );
      }
      this.eventEmitter.emit(
        WORKSPACE_NOTIFICATION_EVENT,
        new InstigoNotification({
          providerId: NotificationCodes.COST_CAP_REACH,
          title: `Workspace Owner account has reached the limit cost cap`,
          description: `Workspace Owner account has reached the limit cost cap`,
          provider: NotificationSupportedProviders.INSTIGO,
          type: NotificationType.ERROR,
          banner: true,
          workspace: workspace,
        }),
      );
    });
  }
}
