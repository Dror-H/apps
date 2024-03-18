import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { User } from '@api/user/data/user.entity';
import { Resources } from '@instigo-app/data-transfer-object';
import { Body, Get, Inject, Post } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@CompositionDecorator({ resource: Resources.SUBSCRIPTIONS, controller: 'payments' })
export class PaymentController {
  @Inject(PaymentService)
  private readonly paymentService: PaymentService;

  @Get()
  payments(@CurrentUser() user: Partial<User>) {
    return this.paymentService.payments({ user });
  }

  @Post()
  changePaymentMethod(@Body() body: { payment: string }, @CurrentUser() user: Partial<User>): Promise<any> {
    return this.paymentService.changePaymentMethod({ user, payment: body.payment });
  }
}
