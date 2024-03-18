import { User } from '@api/user/data/user.entity';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { SubscriptionStatusEnum } from '@instigo-app/data-transfer-object';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { subDays } from 'date-fns';
import Stripe from 'stripe';
import { LessThan, Repository } from 'typeorm';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class SubscriptionCronJobService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  async activateBasicPlanForExpiredTrials() {
    const users = await this.userRepository.find({
      where: { createdAt: LessThan(subDays(new Date(), 14)) },
      relations: ['ownedWorkspace'],
    });
    for (const user of users) {
      const { data: subscription } = await this.subscriptionService.getSubscription({ user });
      if (subscription.status === SubscriptionStatusEnum.TRIAL_EXPIRED) {
        const { data: customer } = await this.subscriptionService.findOrCreateCustomer({ user });
        if (customer.invoice_settings?.default_payment_method) {
          const { data } = await this.subscriptionService.createSubscription({
            user,
            price: 'price_1JhsLsKlYpB2IMP7IcF3IEjt',
            quantity: 1,
            workspaceId: user.ownedWorkspace[0].id,
          });
        }
      }
    }
  }
}
