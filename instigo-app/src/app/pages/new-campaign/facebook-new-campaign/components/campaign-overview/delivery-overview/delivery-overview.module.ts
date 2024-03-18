import { NgModule } from '@angular/core';
import { DeliveryOverviewComponent } from './delivery-overview.component';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { BiddingStrategyNamePipe } from './bidding-strategy-name.pipe';
import { OptimizedForPipe } from './optimized-for.pipe';

@NgModule({
  declarations: [DeliveryOverviewComponent, OptimizedForPipe, BiddingStrategyNamePipe],
  imports: [CommonModule, UiSharedModule, NzCardModule],
  exports: [DeliveryOverviewComponent],
})
export class DeliveryOverviewModule {}
