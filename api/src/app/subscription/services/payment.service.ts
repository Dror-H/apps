import { User } from '@api/user/data/user.entity';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  readonly logger = new Logger(PaymentService.name);

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  public async payments(options: { user: Partial<User> }) {
    const [err, user] = await to(this.userRepository.findOne({ id: options.user.id }));
    if (err || !user.stripeCustomerId) {
      return [];
    }
    const [err_payment_method, payment_methods] = await to(
      this.stripeService.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      }),
    );
    if (err_payment_method) {
      return [];
    }
    return payment_methods.data;
  }

  public async changePaymentMethod(options: { user: Partial<User>; payment: string }) {
    try {
      const { payment } = options;
      const user = await this.userRepository.findOne({ id: options.user.id });

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
      throw new Error('Failed to update payment method');
    }
  }
}
