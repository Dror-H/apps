import { AdSpendService } from '@api/insights/services/ad-spend.service';
import { User } from '@api/user/data/user.entity';
import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import {
  availablePlans,
  StripeEventTypes,
  subscriptionStatus,
  SubscriptionStatusEnum,
} from '@instigo-app/data-transfer-object';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { addDays, differenceInDays, format, fromUnixTime } from 'date-fns';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Merge } from 'type-fest';
import { shouldIProcessEvent, STRIPE_PROD_INSTIGO, STRIPE_STAGING_INSTIGO } from '@instigo-app/api-shared';

export interface SubscriptionModel {
  id: string;
  nextPayment: string;
  quantity: number;
  billingCycle: string;
  latestInvoice: string | Stripe.Invoice;
  planCost: number;
  spendCap: number;
  cancelAtPeriodEnd: boolean;
  price: string;
  used: number;
  status: string;
  active: boolean;
  color: string;
  label: string;
}

@Injectable()
export class SubscriptionService {
  readonly logger = new Logger(SubscriptionService.name);

  @Inject(AdSpendService)
  private readonly adSpendService: AdSpendService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  private planList = availablePlans;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  public async findOrCreateCustomer(options: { user: Partial<User> }): Promise<{ data: Stripe.Customer }> {
    const user = await this.userRepository.findOne({ id: options.user.id });
    if (user) {
      const [err, data] = await to(
        this.stripeService.customers.list({
          limit: 1,
          email: user.email,
        }),
      );
      const stripeCustomer = data.data[0];
      if (stripeCustomer && !err) {
        await to(this.userRepository.update({ id: user.id }, { stripeCustomerId: stripeCustomer.id }));
        return { data: stripeCustomer };
      }
      return await this.createCustomer({ user });
    }
    return await this.createCustomer({ user });
  }

  public async cancelSubscription(options: { user: Partial<User> }): Promise<{ data: string }> {
    let { user } = options;
    user = await this.userRepository.findOne({ id: user.id });
    const [err, subscriptions] = await to(this.stripeService.subscriptions.list({ customer: user.stripeCustomerId }));
    const [subscription] = subscriptions.data.filter(
      (sub: Stripe.Subscription & { plan: { product: string } }) =>
        sub.status === 'active' &&
        (sub.plan.product === STRIPE_STAGING_INSTIGO || sub.plan.product === STRIPE_PROD_INSTIGO),
    );
    if (err) {
      throw new Error(`Failed to retrieve subscription for ${user.email}`);
    }
    void (await this.stripeService.subscriptions.update(subscription.id, { cancel_at_period_end: true }));
    return { data: 'Subscription cancelled' };
  }

  public async getSubscription(options: {
    user: Partial<User>;
  }): Promise<{ data: Partial<SubscriptionModel>; metadata?: any }> {
    let { user } = options;
    if (!user) {
      return { data: null };
    }
    user = await this.userRepository.findOne({ id: user?.id });
    const { data: customer } = await this.findOrCreateCustomer({ user });

    const [err, subscriptions] = await to(
      this.stripeService.subscriptions.list({ customer: customer.id, status: 'all' }),
    );
    const [subscription] = subscriptions.data.filter(
      (sub: Stripe.Subscription & { plan: { product: string } }) =>
        sub.status === 'active' &&
        (sub.plan.product === STRIPE_STAGING_INSTIGO || sub.plan.product === STRIPE_PROD_INSTIGO),
    );

    if (err || subscription == undefined) {
      const data = await this.subscriptionData({
        user,
        subscription: {} as Merge<Stripe.Subscription, { quantity: number; plan: Stripe.Plan }>,
      });
      await to(
        this.userRepository.update({ id: user.id }, { stripeSubscriptionId: null, subscriptionStatus: data.active }),
      );
      return {
        data: data,
      };
    }
    const subscriptionData = await this.subscriptionData({
      user,
      subscription: subscription as Merge<Stripe.Subscription, { quantity: number; plan: Stripe.Plan }>,
    });
    if (!subscriptionData.active) {
      await to(this.userRepository.update({ id: user.id }, { stripeSubscriptionId: null, subscriptionStatus: false }));
    }
    if (subscriptionData.active) {
      await to(
        this.userRepository.update(
          { id: user.id },
          { stripeSubscriptionId: subscriptionData.id, subscriptionStatus: true },
        ),
      );
    }
    return {
      data: subscriptionData,
      metadata: subscription,
    };
  }

  private async subscriptionData(options: {
    user: Partial<User>;
    subscription: Merge<Stripe.Subscription, { quantity: number; plan: Stripe.Plan }> | null;
  }): Promise<Partial<SubscriptionModel>> {
    const { user, subscription } = options;
    const model = {
      id: subscription?.id,
      nextPayment: format(
        subscription?.billing_cycle_anchor ? fromUnixTime(subscription?.billing_cycle_anchor) : addDays(new Date(), 14),
        'dd/MM/yyyy',
      ),
      quantity: subscription?.quantity || 1,
      billingCycle: this.billingCycle({ subscription }),
      latestInvoice: subscription?.latest_invoice,
      planCost: this.planList[(subscription?.quantity ?? 1) - 1].price,
      spendCap: this.planList[(subscription?.quantity ?? 1) - 1].cap,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end,
      price: subscription?.plan?.id,
      used: (
        await this.adSpendService.userAdSpend({
          user,
        })
      ).total,
      status: this.subscriptionStatus({ user, subscription }),
      active: false,
      color: null,
      label: null,
    };
    model.active = model.status === SubscriptionStatusEnum.ACTIVE || model.status === SubscriptionStatusEnum.TRIAL;
    model.color = subscriptionStatus.find((sub) => sub.id == (model.status as any)).color;
    model.label = subscriptionStatus.find((sub) => sub.id == (model.status as any)).label;
    return model;
  }

  private billingCycle(options: { subscription: Merge<Stripe.Subscription, { plan: Stripe.Plan }> }): string {
    const { subscription } = options;
    if (subscription?.plan?.interval === 'year') {
      return 'yearly';
    }
    if (subscription?.plan?.interval_count === 3) {
      return 'quarterly';
    }
    return 'monthly';
  }

  private subscriptionStatus(options: {
    user: Partial<User>;
    subscription: Stripe.Subscription;
  }): SubscriptionStatusEnum {
    const { user, subscription } = options;
    if (subscription?.id && subscription?.status === 'active') {
      return SubscriptionStatusEnum.ACTIVE;
    }
    if (['past_due', 'unpaid'].includes(subscription?.status)) {
      return SubscriptionStatusEnum.PAYMENT_FAILED;
    }
    if (['canceled', 'incomplete', 'incomplete_expired'].includes(subscription?.status)) {
      return SubscriptionStatusEnum.CANCELLED;
    }
    if (Math.abs(differenceInDays(user.createdAt, new Date())) < 14) {
      return SubscriptionStatusEnum.TRIAL;
    }
    return SubscriptionStatusEnum.TRIAL_EXPIRED;
  }

  public getSubscriptionsPlans(): any {
    return this.stripeService.prices.list({ expand: ['data.product'] });
  }

  public async updateSubscription(options: {
    user: Partial<User>;
    price: string;
    quantity: number;
    coupon?: string;
  }): Promise<{ data: Stripe.Subscription | Stripe.PaymentIntent }> {
    let { user } = options;
    const { price, quantity = 1 } = options;
    user = await this.userRepository.findOne({ id: user.id });
    const [err, subscription] = await to(this.stripeService.subscriptions.retrieve(user.stripeSubscriptionId));
    const [err_update, updated_subscription] = await to(
      this.stripeService.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: false,
        items: [
          {
            id: subscription.items.data[0].id,
            quantity,
            price,
          },
        ],
      }),
    );
    if (updated_subscription?.status !== 'active') {
      return { data: (await this.stripeService.paymentIntents.list({ customer: user.stripeCustomerId })).data[0] };
    }
    if (err || err_update) {
      this.logger.error(err);
      throw err;
    }
    return { data: updated_subscription };
  }

  public async createSubscription(options: {
    user: Partial<User>;
    price: string;
    quantity: number;
    workspaceId: string;
    coupon?: string;
  }): Promise<{ data: Stripe.Subscription | Stripe.PaymentIntent }> {
    const { coupon, workspaceId, price, user, quantity = 1 } = options;
    const { data: customer } = await this.findOrCreateCustomer({ user });
    const subscription = await this.stripeService.subscriptions.create({
      customer: customer.id,
      items: [{ price, quantity }],
      expand: ['latest_invoice.payment_intent'],
      coupon: coupon,
      metadata: {
        user: customer.email,
        workspace: workspaceId,
        instigo: 'true',
      },
    });
    if (subscription.status !== 'active') {
      return { data: (await this.stripeService.paymentIntents.list({ customer: customer.id })).data[0] };
    }
    return { data: subscription };
  }

  public async getCoupon(options: { id: string }): Promise<{ data: Stripe.Coupon }> {
    const { id } = options;
    const [error, coupon] = await to(this.stripeService.coupons.retrieve(id));
    if (error) {
      throw new Error('Failed to retrieve coupon');
    }
    return { data: coupon };
  }

  private async createCustomer(options: { user: Partial<User> }): Promise<{ data: Stripe.Customer }> {
    const { user } = options;
    const data: Stripe.CustomerCreateParams = {
      email: user.email,
      name: `${user?.firstName} ${user?.lastName}`,
      description: `${user?.firstName} ${user?.lastName}`,
      phone: user?.phone,
      metadata: { id: user.id },
      ...(user.billing ? { address: { line1: `${user.billing?.address} ${user.billing?.zipCode}` } } : {}),
    };
    const [err, customer] = await to(this.stripeService.customers.create(data));
    if (err) {
      throw new Error('Failed to create stripe customer');
    }
    await this.userRepository.update({ id: user.id }, { stripeCustomerId: customer.id });
    return { data: customer };
  }

  @StripeWebhookHandler(StripeEventTypes.CUSTOMER_SUBSCRIPTION_CREATED)
  async handlePaymentIntentCreated(event: Stripe.Event) {
    if (!shouldIProcessEvent(event, 'instigo')) {
      return;
    }
    const customer = event['data']['object']['customer'];
    const subscription: any = event['data']['object'];
    const user = await this.userRepository.findOne({ stripeCustomerId: customer });
    this.logger.log(`${StripeEventTypes.CUSTOMER_SUBSCRIPTION_CREATED} for user ${user.email}`);
    const mail = this.upgradeEmailBody({ user, plan: subscription.metadata.type });
    await this.mailerService.sendMail(mail).catch((err) => {
      this.logger.error(err);
    });
  }

  upgradeEmailBody(options: { user: Partial<User>; plan: any }) {
    const {
      user: { email, fullName },
      plan,
    } = options;
    return {
      to: email,
      subject: 'Congratulations for upgrading Instigo 🎉',
      template: 'subscription-upgrade',
      context: {
        name: fullName,
        plan: plan,
      },
    };
  }
}
