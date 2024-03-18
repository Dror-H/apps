import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { CreateSubscriptionDTO } from '@audiences-api/zod-schemas';
import { ControllerDecoratorWithGuardsAndSwagger, CurrentUser } from '@instigo-app/api-shared';
import { Resources } from '@instigo-app/data-transfer-object';
import { Body, Get, Inject, Param, Post, UsePipes } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionService } from './subscription.service';

@ControllerDecoratorWithGuardsAndSwagger({ resource: Resources.SUBSCRIPTIONS })
@UsePipes(ZodValidationPipe)
export class SubscriptionController {
  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  @Get()
  getSubscription(@CurrentUser() user: { id: string }): Promise<Stripe.Subscription> {
    return this.subscriptionService.getUserSubscription({ user });
  }

  @Post()
  createSubscription(@CurrentUser() user: { id: string }, @Body() body: CreateSubscriptionDTO): Promise<any> {
    const { coupon } = body;
    return this.subscriptionService.createSubscription({ user, coupon });
  }

  @Get('coupons/:id')
  getCoupon(@Param('id') id: string): Promise<{ data: Stripe.Coupon }> {
    return this.subscriptionService.getCoupon({ id });
  }
}
