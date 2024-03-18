import { getCurrencySymbol } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { CampaignDTO } from '@instigo-app/data-transfer-object';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { filter, map, skip } from 'rxjs/operators';
import { CampaignDetailsService } from '../../campaign-details.service';
import { singularChartsOptions } from '../chart-options';

@Component({
  selector: 'app-daily-average-breakdown',
  templateUrl: './daily-average-breakdown.component.html',
  styleUrls: ['./daily-average-breakdown.component.scss'],
})
export class DailyAverageBreakdown implements OnInit {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }>;

  @ViewChild('baseChart')
  mainChartRef: BaseChartDirective;

  public mainChart: { chartData; type; chartLabels };
  public mainChartOptions: any = {};
  public mainChartMetrics: { hidden: boolean; color: string }[] = [];

  constructor(public campaignDetailsService: CampaignDetailsService, private analytics: AnalyticsService) {}

  ngOnInit() {
    this.mainChartOptions = singularChartsOptions(null);
    this.selectedCampaign$
      .pipe(
        skip(1),
        filter((data) => data.type === 'finish'),
        map((result) => {
          this.mainChartOptions = singularChartsOptions(
            getCurrencySymbol(this.campaignDetailsService.campaignCurrency.getValue(), 'narrow'),
          );
          return this.campaignDetailsService.buildChart(result, 0, true, 'dailyBreakdowns');
        }),
      )
      .subscribe((result) => {
        this.mainChartMetrics = result.chartData?.map((v) => ({
          hidden: v.hidden,
          color: v.hoverBackgroundColor,
        }));
        this.mainChart = result;
      });
  }

  public updateMetricVisibility(i: number, label: string): void {
    let updateMetrics = this.mainChartMetrics;
    updateMetrics[i].hidden = !updateMetrics[i].hidden;
    this.mainChartMetrics = updateMetrics;
    let ci = this.mainChartRef.chart;
    ci.getDatasetMeta(i).hidden = ci.getDatasetMeta(i).hidden === null ? !ci.data.datasets[i].hidden : null;
    ci.update();

    this.analytics.sendEvent({
      event: 'Chart',
      action: 'toggle_metric',
      data: {
        event: 'Chart',
        chartLocation: 'Campaign Details',
        chart: 'Daily Average Breakdown',
        toggledMetric: `${this.selectedCampaign$.value.value.provider}-${label.toLowerCase()}`,
        toggledPrevState: updateMetrics[i].hidden,
        toggledNewState: !updateMetrics[i].hidden,
      },
    });
  }
}
