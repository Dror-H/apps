import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkspaceOverviewComponent } from './workspace-overview.component';
import { WorkspaceOverviewChartComponent } from './components/workspace-overview-chart.component';
import { ChartsModule } from 'ng2-charts';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [WorkspaceOverviewChartComponent, WorkspaceOverviewComponent],
  imports: [
    CommonModule,
    ChartsModule,
    NzGridModule,
    NzCardModule,
    NzDividerModule,
    NzMenuModule,
    NzDropDownModule,
    NzSpinModule,
  ],
  exports: [WorkspaceOverviewComponent],
  providers: [],
})
export class WorkspaceOverviewModule {}
