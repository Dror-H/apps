import { ControllerDecoratorWithGuardsAndSwagger, CurrentUser } from '@instigo-app/api-shared';
import { Resources } from '@instigo-app/data-transfer-object';
import { Body, Get, Inject, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentService } from './payment.service';

@ControllerDecoratorWithGuardsAndSwagger({ resource: Resources.PAYMENTS })
export class PaymentController {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @Get()
  payments(@CurrentUser() user: { id: string }): Promise<Stripe.PaymentMethod[]> {
    return this.paymentService.payments({ user });
  }

  @Post()
  changePaymentMethod(@CurrentUser() user: { id: string }, @Body() body: { payment: string }): Promise<any> {
    return this.paymentService.changePaymentMethod({ user, payment: body.payment });
  }
}
