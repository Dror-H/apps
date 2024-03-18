import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import { shouldIProcessEvent } from '@instigo-app/api-shared';
import { StripeEventTypes } from '@instigo-app/data-transfer-object';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import to from 'await-to-js';
import Stripe from 'stripe';
import { CustomerService } from './customer.service';

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

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(CustomerService)
  private readonly customerService: CustomerService;

  @Inject(ConfigService)
  protected readonly configService: ConfigService;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  public async getUserSubscription(options: { user: { id: string } }): Promise<Stripe.Subscription> {
    return await this.customerService.getUserSubscription({ user: options.user });
  }

  public async createSubscription(options: {
    user: { id: string };
    coupon?: string;
  }): Promise<{ data: Stripe.Subscription | Stripe.PaymentIntent }> {
    const { coupon, user } = options;
    const { data: customer } = await this.customerService.findOrCreateCustomer({ user });
    const STRIPE_MONTHLY_PRICE = this.configService.get<string>('STRIPE_MONTHLY_PRICE');
    const subscription = await this.stripeService.subscriptions.create({
      customer: customer.id,
      items: [{ price: STRIPE_MONTHLY_PRICE }],
      expand: ['latest_invoice.payment_intent'],
      coupon: coupon,
      metadata: {
        user: JSON.stringify(user),
        audiences: 'true',
      },
    });
    await this.prismaService.user.update({ data: { stripeSubscriptionId: subscription.id }, where: { id: user.id } });
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

  @StripeWebhookHandler(StripeEventTypes.CUSTOMER_SUBSCRIPTION_CREATED)
  async handlePaymentIntentCreated(event: Stripe.Event): Promise<void> {
    if (!shouldIProcessEvent(event, 'audiences')) {
      return;
    }
    const customer = event['data']['object']['customer'];
    const [, user] = await to(this.prismaService.user.findFirst({ where: { stripeCustomerId: customer } }));
    this.logger.log(`${StripeEventTypes.CUSTOMER_SUBSCRIPTION_CREATED} for user ${user.email}`);
    const mail = this.upgradeEmailBody({ user });
    await this.mailerService.sendMail(mail).catch((err) => {
      this.logger.error(err);
    });
  }

  upgradeEmailBody(options: { user: User }): ISendMailOptions {
    const {
      user: { email, name },
    } = options;
    return {
      to: email,
      subject: 'Congratulations for Subscribing to Instigo Audiences🎉',
      template: 'audiences-subscription',
      context: {
        name: name,
      },
    };
  }
}
