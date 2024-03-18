import { AuthModule } from '@audiences-api/auth/auth.module';
import { PrismaModule } from '@audiences-api/prisma/prisma.module';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerService } from './customer.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MeController } from './me.controller';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { VatController } from './vat.controller';
import { VatService } from './vat.service';
import { applyRawBodyOnlyTo } from '@golevelup/nestjs-webhooks';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_SECRET_KEY'),
        apiVersion: '2020-08-27',
        typescript: true,
        webhookConfig: {
          stripeWebhookSecret: configService.get<string>('STRIPE_WEBHOOK_SECRET'),
        },
      }),
    }),
  ],
  controllers: [VatController, MeController, PaymentController, InvoiceController, SubscriptionController],
  providers: [VatService, PaymentService, CustomerService, InvoiceService, SubscriptionService],
  exports: [VatService, PaymentService, CustomerService, InvoiceService, SubscriptionService],
})
export class AccountControlModule {
  configure(consumer: MiddlewareConsumer): void {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'stripe/webhook',
    });
  }
}
