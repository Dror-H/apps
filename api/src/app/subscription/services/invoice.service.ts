import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import { mapInvoices, shouldIProcessEvent } from '@instigo-app/api-shared';
import { StripeEventTypes } from '@instigo-app/data-transfer-object';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { User } from '../../user/data/user.entity';

@Injectable()
export class InvoiceService {
  readonly logger = new Logger(InvoiceService.name);

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  async invoice(options: { customer: string; take?: number; cursor?: { id: string } }): Promise<any[]> {
    const { customer, take = 10 } = options;
    const [error, response] = await to(this.stripeService.invoices.list({ customer, limit: take }));
    if (error) {
      return [];
    }
    return mapInvoices({ data: response.data, product: 'instigo' });
  }

  @StripeWebhookHandler(StripeEventTypes.INVOICE_PAYMENT_FAILED)
  async handleInvoiceFailed(event: Stripe.Event): Promise<void> {
    if (!shouldIProcessEvent(event, 'instigo')) {
      return;
    }
    const customer = event['data']['object']['customer'];
    const invoice = event.data.object['invoice_pdf'];
    const [, user] = await to(this.userRepository.findOne({ stripeCustomerId: customer }));
    if (user) {
      const mail = this.paymentFailed({ user, invoice });
      await this.mailerService.sendMail(mail).catch((err) => {
        this.logger.error(err);
      });
    }
  }

  @StripeWebhookHandler(StripeEventTypes.INVOICE_FINALIZED)
  async invoiceFinalized(event: Stripe.Event): Promise<void> {
    if (!shouldIProcessEvent(event, 'instigo')) {
      return;
    }
    const customer = event.data.object['customer'];
    const invoice = event.data.object['invoice_pdf'];
    const [, user] = await to(this.userRepository.findOne({ stripeCustomerId: customer }));
    if (user) {
      const mail = this.invoiceNotification({ user, invoice });
      this.logger.log(`invoice ready for ${user.email}`);
      await this.mailerService.sendMail(mail).catch((err) => {
        this.logger.error(err);
      });
    }
  }

  private invoiceNotification(options: { user: Partial<User>; invoice: any }) {
    const {
      user: { email, fullName },
      invoice,
    } = options;
    return {
      to: email,
      subject: 'New Invoice Ready - Instigo',
      template: 'new-invoice',
      context: {
        name: fullName,
        invoice_url: invoice,
      },
    };
  }

  private paymentFailed(options: { user: Partial<User>; invoice: string }) {
    const {
      user: { email, fullName },
      invoice,
    } = options;
    return {
      to: email,
      subject: 'Payment failed - Instigo',
      template: 'payment-failed',
      context: {
        name: fullName,
        invoice_url: invoice,
      },
    };
  }
}
