import { PrismaService } from '@audiences-api/prisma/prisma.service';
import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import { mapInvoices } from '@instigo-app/api-shared';
import { StripeEventTypes } from '@instigo-app/data-transfer-object';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import to from 'await-to-js';
import { shouldIProcessEvent } from 'libs/api/api-shared/src/payments/product-id';
import Stripe from 'stripe';
import { CustomerService } from './customer.service';

@Injectable()
export class InvoiceService {
  readonly logger = new Logger(InvoiceService.name);

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(CustomerService)
  private readonly customerService: CustomerService;
  constructor(
    @InjectStripeClient()
    private readonly stripeService: Stripe,
  ) {}

  async invoice(options: { user: { id: string }; take?: number; cursor?: { id: string } }): Promise<any[]> {
    const { user, take = 10 } = options;
    const { data: customer } = await this.customerService.findOrCreateCustomer({ user: { id: user.id } });
    const [error, response] = await to(this.stripeService.invoices.list({ customer: customer.id, limit: take }));
    if (error) {
      return [];
    }
    return mapInvoices({ data: response.data, product: 'audiences' });
  }

  @StripeWebhookHandler(StripeEventTypes.INVOICE_PAYMENT_FAILED)
  async handleInvoiceFailed(event: Stripe.Event): Promise<void> {
    if (!shouldIProcessEvent(event, 'audiences')) {
      return;
    }
    const customer = event['data']['object']['customer'];
    const invoice = event.data.object['invoice_pdf'];

    const [, user] = await to(this.prismaService.user.findFirst({ where: { stripeCustomerId: customer } }));

    if (user) {
      const mail = this.paymentFailed({ user, invoice });
      await this.mailerService.sendMail(mail).catch((err) => {
        this.logger.error(err);
      });
    }
  }

  @StripeWebhookHandler(StripeEventTypes.INVOICE_FINALIZED)
  async invoiceFinalized(event: Stripe.Event): Promise<void> {
    if (!shouldIProcessEvent(event, 'audiences')) {
      return;
    }
    const customer = event.data.object['customer'];
    const invoice = event.data.object['invoice_pdf'];
    const [, user] = await to(this.prismaService.user.findFirst({ where: { stripeCustomerId: customer } }));
    if (user) {
      const mail = this.invoiceNotification({ user, invoice });
      this.logger.log(`invoice ready for ${user.email}`);
      await this.mailerService.sendMail(mail).catch((err) => {
        this.logger.error(err);
      });
    }
  }

  private invoiceNotification(options: { user: Partial<User>; invoice: any }): ISendMailOptions {
    const {
      user: { email, name },
      invoice,
    } = options;
    return {
      to: email,
      subject: 'New Invoice Ready - Instigo',
      template: 'new-invoice',
      context: {
        name: name,
        invoice_url: invoice,
      },
    };
  }

  private paymentFailed(options: { user: Partial<User>; invoice: string }): ISendMailOptions {
    const {
      user: { email, name },
      invoice,
    } = options;
    return {
      to: email,
      subject: 'Payment failed - Instigo',
      template: 'payment-failed',
      context: {
        name: name,
        invoice_url: invoice,
      },
    };
  }
}
