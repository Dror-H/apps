import { NgModule } from '@angular/core';
import { MainChartWidgetComponent } from './main-chart.widget.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared/shared.module';
import { CampaignDetailsService } from '@app/pages/campaign-details/campaign-details.service';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [MainChartWidgetComponent],
  imports: [
    SharedModule,
    CommonModule,
    ChartsModule,
    TranslateModule,
    UiSharedModule,
    NzToolTipModule,
    NzGridModule,
    NzEmptyModule,
    NzSkeletonModule,
    NzCardModule,
  ],
  exports: [MainChartWidgetComponent],
  providers: [CampaignDetailsService],
})
export class MainChartWidgetModule {}
