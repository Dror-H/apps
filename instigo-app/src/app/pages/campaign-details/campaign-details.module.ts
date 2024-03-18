import { NgModule } from '@angular/core';
import { CampaignDetailsComponent } from './campaign-details.component';
import { CampaignDetailsService } from './campaign-details.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { DateRangePickerModule } from '../../features/date-range-picker/date-range-picker.module';
import { CampaignSearchModule } from './components/campaign-search/campaign-search.module';
import { OverviewModule } from './components/overview/overview.module';
import { CampaignSummaryModule } from './components/campaign-summary/campaign-summary.module';
import { CampaignTargetingModule } from './components/campaign-targeting/campaign-targeting.module';
import { CampaignAdsetsTableModule } from './components/campaign-adsets-table/campaign-adsets-table.module';
import { CampaignAdsTableModule } from './components/campaign-ads-table/campaign-ads-table.module';
import { BreakdownDetailsTableModule } from './components/breakdown-details-table/breakdown-details-table.module';
import { CampaignLifetimePerformanceModule } from './components/campaign-lifetime-performance/campaign-lifetime-performance.module';
import { DailyAverageBreakdownModule } from './components/daily-average-breakdown/daily-average-breakdown.module';
import { HourAverageBreakdownModule } from './components/hour-average-breakdown/hour-average-breakdown.module';
import { EngagementMetricsModule } from './components/engagement-metrics/engagement-metrics.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CampaignDetailsRoutingModule } from './campaign-details-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  declarations: [CampaignDetailsComponent],
  imports: [
    NzTabsModule,
    NzButtonModule,
    ReactiveFormsModule,
    CampaignDetailsRoutingModule,
    DateRangePickerModule,
    CampaignSearchModule,
    OverviewModule,
    CampaignSummaryModule,
    CampaignTargetingModule,
    CampaignAdsetsTableModule,
    CampaignAdsTableModule,
    BreakdownDetailsTableModule,
    CampaignLifetimePerformanceModule,
    DailyAverageBreakdownModule,
    HourAverageBreakdownModule,
    EngagementMetricsModule,
    NzGridModule,
    NzPageHeaderModule,
    CommonModule,
  ],
  providers: [CampaignDetailsService],
})
export class CampaignDetailsModule {}
