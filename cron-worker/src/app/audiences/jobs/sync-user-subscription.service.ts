import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Stripe from 'stripe';
import { DatabaseService } from '../../database/db.service';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { sql } from 'slonik';
import PromisePool from '@supercharge/promise-pool';
import to from 'await-to-js';
import { ProgressBar, STRIPE_PROD_AUDIENCES, STRIPE_STAGING_AUDIENCES } from '@instigo-app/api-shared';

@Injectable()
export class SyncUserSubscriptionService {
  private logger = new Logger(SyncUserSubscriptionService.name);

  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, { name: 'sync-user-subscription' })
  async syncUserSubscription(): Promise<void> {
    const users = await this.databaseService.audiences.many<{ id: string; email: string; stripe_customer_id: string }>(
      sql`select id,email,stripe_customer_id from users`,
    );
    const progress = new ProgressBar({ total: users.length, identifier: 'sync-user-subscription' });
    this.logger.log(`Found ${users.length} users to sync`);
    const { errors } = await new PromisePool().for(users.slice()).process(async (user) => {
      const [err, data] = await to(
        this.stripeService.customers.list({
          limit: 1,
          email: user.email,
        }),
      );
      let costumer_id = user.stripe_customer_id;
      if (!err && data && data.data.length > 0) {
        costumer_id = data.data[0].id;
      }
      const [, subscriptions] = await to(
        this.stripeService.subscriptions.list({ customer: costumer_id, status: 'all' }),
      );
      const [subscription] =
        subscriptions?.data.filter(
          (sub: Stripe.Subscription & { plan: { product: string } }) =>
            sub.status === 'active' &&
            (sub.plan.product === STRIPE_STAGING_AUDIENCES || sub.plan.product === STRIPE_PROD_AUDIENCES),
        ) || [];

      if (subscription) {
        await this.databaseService.audiences.query<{ id: string; stripe_subscription_id: string }>(
          sql`update users set stripe_subscription_id = ${
            subscription.id
          }  , updated_at = ${new Date().toISOString()} where id = ${user.id}`,
        );
      }
      if (!subscription) {
        await this.databaseService.audiences.query<{ id: string; stripe_subscription_id: string }>(
          sql`update users set stripe_subscription_id = null , updated_at = ${new Date().toISOString()}  where id = ${
            user.id
          }`,
        );
      }
      progress.tick();
    });
    if (errors && errors.length > 0) {
      this.logger.error(errors);
    }
  }
}
