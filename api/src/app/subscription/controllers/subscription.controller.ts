import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { CurrentWorkspaceId } from '@api/shared/current-workspace-id.decorator';
import { CurrentWorkspacePipe } from '@api/shared/current-workspace.pipe';
import { User } from '@api/user/data/user.entity';
import { Resources, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Body, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { InvoiceService } from '../services/invoice.service';
import { SubscriptionModel, SubscriptionService } from '../services/subscription.service';

@CompositionDecorator({ resource: Resources.SUBSCRIPTIONS })
export class SubscriptionController {
  @Inject(SubscriptionService)
  private readonly subscriptionService: SubscriptionService;

  @Inject(InvoiceService)
  private readonly invoiceService: InvoiceService;

  @Get()
  getSubscription(@CurrentUser() user: Partial<User>): Promise<{ data: Partial<SubscriptionModel>; metadata?: any }> {
    return this.subscriptionService.getSubscription({ user });
  }

  @Post()
  createSubscription(
    @Body() body: { price: string; quantity?: number; coupon?: string },
    @CurrentWorkspaceId() workspaceId: string,
    @CurrentUser() user: Partial<User>,
  ): Promise<any> {
    const { price, coupon, quantity } = body;
    return this.subscriptionService.createSubscription({ user, price, quantity, coupon, workspaceId });
  }

  @Patch()
  updateSubscription(
    @CurrentUser() user: Partial<User>,
    @Body() body: { price: string; quantity?: number; coupon?: string },
  ): Promise<{ data: Stripe.Subscription | Stripe.PaymentIntent }> {
    const { price, coupon, quantity } = body;
    return this.subscriptionService.updateSubscription({ user, price, coupon, quantity });
  }

  @Delete()
  deleteSubscription(@CurrentUser() user: Partial<User>) {
    return this.subscriptionService.cancelSubscription({ user });
  }

  @Post('customers')
  findOrCreateCustomer(@CurrentUser() user: Partial<User>): Promise<{ data: Stripe.Customer }> {
    return this.subscriptionService.findOrCreateCustomer({ user });
  }

  @Get('coupons/:id')
  getCoupon(@Param('id') id: string) {
    return this.subscriptionService.getCoupon({ id });
  }

  @Get('plans')
  getSubscriptionsPlans() {
    return this.subscriptionService.getSubscriptionsPlans();
  }

  @Get('invoices')
  invoice(@CurrentWorkspaceId(CurrentWorkspacePipe) currentWorkspace: WorkspaceDTO) {
    return this.invoiceService.invoice({ customer: currentWorkspace.owner?.stripeCustomerId });
  }
}
