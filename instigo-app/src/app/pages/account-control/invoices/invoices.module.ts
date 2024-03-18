import { NgModule } from '@angular/core';
import { SubscriptionsApiService } from '@app/api/services/subscriptions.api.service';
import { SUBSCRIPTIONS_API_SERVICE, UiSharedModule } from '@instigo-app/ui/shared';
import { InvoicesRoutingModule } from './invoices-routing.module';

@NgModule({
  imports: [UiSharedModule, InvoicesRoutingModule],
  providers: [{ provide: SUBSCRIPTIONS_API_SERVICE, useClass: SubscriptionsApiService }],
})
export class InvoicesModule {}
