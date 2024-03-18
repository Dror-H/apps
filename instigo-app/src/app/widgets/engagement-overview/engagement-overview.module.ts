import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EngagementOverviewComponent } from './engagement-overview.component';
import { EngagementOverviewChartComponent } from './components/engagement-overview-chart.component';
import { ChartsModule } from 'ng2-charts';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [EngagementOverviewChartComponent, EngagementOverviewComponent],
  imports: [CommonModule, ChartsModule, NzGridModule, NzCardModule],
  exports: [EngagementOverviewComponent],
  providers: [],
})
export class EngagementOverviewModule {}
