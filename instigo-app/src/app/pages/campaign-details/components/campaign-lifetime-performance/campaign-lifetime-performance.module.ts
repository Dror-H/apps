import { NgModule } from '@angular/core';
import { CampaignLifetimePerformanceComponent } from './campaign-lifetime-performance.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TranslateModule } from '@ngx-translate/core';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CampaignLifetimePerformanceComponent],
  imports: [
    CommonModule,
    ChartsModule,
    TranslateModule,
    NzCardModule,
    NzToolTipModule,
    NzSkeletonModule,
    NzSpinModule,
    UiSharedModule,
  ],
  exports: [CampaignLifetimePerformanceComponent],
})
export class CampaignLifetimePerformanceModule {}
