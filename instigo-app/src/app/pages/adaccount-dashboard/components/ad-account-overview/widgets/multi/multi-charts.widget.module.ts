import { NgModule } from '@angular/core';
import { MultiChartsWidgetComponent } from './multi-charts.widget.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CampaignDetailsService } from '@app/pages/campaign-details/campaign-details.service';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [MultiChartsWidgetComponent],
  imports: [
    CommonModule,
    ChartsModule,
    TranslateModule,
    UiSharedModule,
    NzGridModule,
    NzToolTipModule,
    NzSpinModule,
    NzEmptyModule,
    NzSkeletonModule,
    NzCardModule,
  ],
  exports: [MultiChartsWidgetComponent],
  providers: [CampaignDetailsService],
})
export class MultiChartsWidgetModule {}
