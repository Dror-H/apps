import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeviceBreakdownModule } from '@app/widgets/device-breakdown/device-breakdown.module';
import { VectorMapTableModule } from '@app/widgets/vector-map-table/vector-map-table.module';
import { VectorMapModule } from '@app/widgets/vector-map/vector-map.module';
import { NgxsModule } from '@ngxs/store';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AdAccountOverviewComponent } from './ad-account-overview.component';
import { MainChartWidgetModule } from './widgets/main/main-chart.widget.module';
import { MultiChartsWidgetModule } from './widgets/multi/multi-charts.widget.module';
import { UiSharedModule } from '@instigo-app/ui/shared';

const ngzorro = [
  NzPageHeaderModule,
  NzSkeletonModule,
  NzSpinModule,
  NzTagModule,
  NzEmptyModule,
  NzCardModule,
  NzDividerModule,
  NzDropDownModule,
  NzGridModule,
  NzMenuModule,
];

@NgModule({
  declarations: [AdAccountOverviewComponent],
  imports: [
    CommonModule,
    NgxsModule,
    ...ngzorro,
    MainChartWidgetModule,
    MultiChartsWidgetModule,
    VectorMapModule,
    VectorMapTableModule,
    DeviceBreakdownModule,
    UiSharedModule,
  ],
  exports: [AdAccountOverviewComponent],
})
export class AdAccountOverviewModule {}
