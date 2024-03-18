import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { STRIPE_PROD_AUDIENCES, STRIPE_STAGING_AUDIENCES } from '@instigo-app/api-shared';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import to from 'await-to-js';
import Stripe from 'stripe';

@Injectable()
export class CustomerService {
  readonly logger = new Logger(CustomerService.name);
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  public async getUserSubscription(options: { user: { id: string } }): Promise<Stripe.Subscription> {
    const { user } = options;
    const { data: customer } = await this.findOrCreateCustomer({ user });
    const [err, subscriptions] = await to(
      this.stripeService.subscriptions.list({ customer: customer.id, status: 'all' }),
    );
    if (err) {
      throw new NotFoundException('Failed to find subscriptions');
    }
    const [subscription] = subscriptions.data.filter(
      (sub: Stripe.Subscription & { plan: { product: string } }) =>
        sub.status === 'active' &&
        (sub.plan.product === STRIPE_STAGING_AUDIENCES || sub.plan.product === STRIPE_PROD_AUDIENCES),
    );
    return subscription;
  }

  public async findOrCreateCustomer(options: { user: { id: string } }): Promise<{ data: Stripe.Customer }> {
    const [err, user] = await to(this.prismaService.user.findFirst({ where: { id: options.user.id } }));
    if (err || !user) {
      throw new NotFoundException('User not found');
    }
    if (user) {
      const [err, data] = await to(
        this.stripeService.customers.list({
          limit: 1,
          email: user.email,
        }),
      );
      const stripeCustomer = data.data[0];
      if (stripeCustomer && !err) {
        await this.prismaService.user.update({ data: { stripeCustomerId: stripeCustomer.id }, where: { id: user.id } });
        return { data: stripeCustomer };
      }
      return await this.createCustomer({ user });
    }
    return await this.createCustomer({ user });
  }

  private async createCustomer(options: { user: Partial<User> }): Promise<{ data: Stripe.Customer }> {
    const { user } = options;
    const data: Stripe.CustomerCreateParams = {
      email: user.email,
      name: `${user?.name}`,
      metadata: { id: user.id },
    };
    const [err, customer] = await to(this.stripeService.customers.create(data));
    if (err) {
      throw new Error('Failed to create stripe customer');
    }
    await this.prismaService.user.update({ data: { stripeCustomerId: customer.id }, where: { id: user.id } });
    return { data: customer };
  }

  async updateCustomer(options: { user: any }): Promise<Stripe.Response<Stripe.Customer>> {
    const { user } = options;
    return await this.stripeService.customers.update(user.id, {
      ...(user.billing.type === 'company'
        ? {
            company: {
              address: {
                line1: `${user.billing?.address} ${user.billing?.zipCode}`,
                postal_code: `${user.billing?.zipCode}`,
                country: user.billing?.country,
              },
              name: user.billing?.companyName,
              tax_id: user.billing?.vatNumber,
            },
          }
        : {}),
      address: {
        line1: `${user.billing?.address} ${user.billing?.zipCode}`,
        postal_code: `${user.billing?.zipCode}`,
        country: user.billing?.country,
      },
    });
  }
}
