import { NgModule } from '@angular/core';
import { DailyAverageBreakdown } from './daily-average-breakdown.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [DailyAverageBreakdown],
  imports: [
    CommonModule,
    ChartsModule,
    TranslateModule,
    NzCardModule,
    NzGridModule,
    NzSkeletonModule,
    NzToolTipModule,
    UiSharedModule,
  ],
  exports: [DailyAverageBreakdown],
})
export class DailyAverageBreakdownModule {}
