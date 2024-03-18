import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import to from 'await-to-js';
import Stripe from 'stripe';
import { CustomerService } from './customer.service';

@Injectable()
export class PaymentService {
  readonly logger = new Logger(PaymentService.name);
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(CustomerService)
  private readonly customerService: CustomerService;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  public async payments(options: { user: Partial<User> }): Promise<Stripe.PaymentMethod[]> {
    const [err, user] = await to(this.prismaService.user.findFirst({ where: { id: options.user.id } }));
    if (err || !user) {
      throw new NotFoundException('User not found');
    }
    const { data: customer } = await this.customerService.findOrCreateCustomer({ user: { id: user.id } });
    const [err_payment_method, payment_methods] = await to(
      this.stripeService.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      }),
    );
    if (err_payment_method) {
      return [];
    }
    return payment_methods.data;
  }

  public async changePaymentMethod(options: { user: Partial<User>; payment: string }): Promise<Stripe.Customer> {
    try {
      const { payment } = options;
      const [err, user] = await to(this.prismaService.user.findFirst({ where: { id: options.user.id } }));
      if (err || !user) {
        throw new NotFoundException('User not found');
      }
      const existing_payments = await this.payments({ user });
      existing_payments.forEach((payment) => {
        void this.stripeService.paymentMethods.detach(payment.id);
      });

      const payment_method = await this.stripeService.paymentMethods.attach(payment, {
        customer: user.stripeCustomerId,
      });

      return await this.stripeService.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: payment_method.id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to update payment method');
    }
  }
}
