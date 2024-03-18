import { CachingModule } from '@api/database';
import { InsightsServicesModule } from '@api/insights/services/insights-services.module';
import { UserModule } from '@api/user/user.module';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { applyRawBodyOnlyTo } from '@golevelup/nestjs-webhooks';
import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './controllers/payment.controller';
import { SubscriptionCronJobsController } from './controllers/subscription-cron-jobs.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { InvoiceService } from './services/invoice.service';
import { PaymentService } from './services/payment.service';
import { SubscriptionCronJobService } from './services/subscription-cron-jobs.service';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    InsightsServicesModule,
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
    CachingModule,
  ],
  providers: [SubscriptionService, InvoiceService, PaymentService, SubscriptionCronJobService],
  controllers: [SubscriptionController, PaymentController, SubscriptionCronJobsController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {
  configure(consumer: MiddlewareConsumer): void {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'stripe/webhook',
    });
  }
}
