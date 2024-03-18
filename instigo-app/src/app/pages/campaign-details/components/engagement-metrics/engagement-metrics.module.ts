import { NgModule } from '@angular/core';
import { EngagementMetricsComponent } from './engagement-metrics.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [EngagementMetricsComponent],
  imports: [
    CommonModule,
    ChartsModule,
    NzCardModule,
    NzSkeletonModule,
    NzToolTipModule,
    TranslateModule,
    UiSharedModule,
  ],
  exports: [EngagementMetricsComponent],
})
export class EngagementMetricsModule {}
