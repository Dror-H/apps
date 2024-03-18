import { getCurrencySymbol } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { BreakdownTypes } from '@app/global/constants';
import { getOneCampaignQuery } from '@app/global/get-one-campaign-query';
import { getTimeQueryParams } from '@app/global/get-time-query-params';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { CampaignDTO } from '@instigo-app/data-transfer-object';
import { groupBy } from 'lodash-es';
import { BaseChartDirective } from 'ng2-charts';
import { concat, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CampaignDetailsService } from '../../campaign-details.service';
import { metricsForHourlyBreakdownChart, singularChartsOptions } from '../chart-options';

@Component({
  selector: 'app-hour-average-breakdown',
  templateUrl: './hour-average-breakdown.component.html',
  styleUrls: ['./hour-average-breakdown.component.scss'],
})
export class HourAverageBreakdownComponent implements OnInit, OnDestroy {
  @ViewChild('baseChart')
  mainChartRef: BaseChartDirective;

  @Input()
  campaignQueryForm = new FormGroup({});

  public mainChartMetrics: { hidden: boolean; color: string }[] = [];
  public mainChart;
  public chartType = 'bar';
  public chartOptions = {};
  public provider = '';
  public hideTip: boolean;

  private subSink = new SubSink();

  constructor(
    private campaignApiService: CampaignApiService,
    public campaignDetailsService: CampaignDetailsService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.chartOptions = singularChartsOptions(null);
    this.subSink.sink = this.campaignQueryForm.valueChanges
      .pipe(
        switchMap((value) =>
          concat(
            of({ type: 'start' }),
            this.campaignApiService
              .insights({
                query: this.getQuery(value),
              })
              .pipe(
                map((response) => response?.data[0]),
                map((value) => ({ type: 'finish', value })),
                catchError(() => of({ type: 'finish', value })),
              ),
          ),
        ),
        tap((campaign: { value: CampaignDTO; type: string }) => {
          if (campaign.value) {
            this.hideTip = !campaign.value.insights.data.length;
            this.provider = `-${campaign.value.provider}`;
            this.chartOptions = singularChartsOptions(
              getCurrencySymbol(this.campaignDetailsService.campaignCurrency.getValue(), 'narrow'),
            );
            this.mainChart = this.buildChart(campaign.value, campaign.type);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public updateMetricVisibility(i: number, label: string): void {
    const updateMetrics = this.mainChartMetrics;
    updateMetrics[i].hidden = !updateMetrics[i].hidden;
    this.mainChartMetrics = updateMetrics;
    const ci = this.mainChartRef.chart;
    ci.getDatasetMeta(i).hidden = ci.getDatasetMeta(i).hidden === null ? !ci.data.datasets[i].hidden : null;
    ci.update();

    this.analytics.sendEvent({
      event: 'Chart',
      action: 'toggle_metric',
      data: {
        event: 'Chart',
        chart: 'Hourly Average Breakdown',
        chartLocation: 'Campaign Details',
        toggledMetric: `${this.provider}${label.toLowerCase()}`,
        toggledPrevState: updateMetrics[i].hidden,
        toggledNewState: !updateMetrics[i].hidden,
      },
    });
  }

  public buildChart(campaign: CampaignDTO, type: string) {
    if (type === 'start') {
      return { type };
    }
    const chartLabels = ['00-03', '03-06', '06-09', '09-12', '12-15', '15-18', '18-21', '21-24'];
    const groupByHour = groupBy(campaign.insights.data, (insights) => insights.hourlyRange);
    const groupByRange = this.groupInsightsByHourRange(groupByHour, chartLabels);
    const chartData = metricsForHourlyBreakdownChart.map((v) => ({
      data: chartLabels.map((label: string) => this.calculateAvgForField(groupByRange[label], v.metric[0])),
      backgroundColor: v.colors[0],
      hoverBackgroundColor: v.colors[1],
      label: v.metric[1],
      yAxisID: v.axis,
      barPercentage: 0.8,
      prefix: v.prefix ? v.prefix : '',
      suffix: v.suffix ? v.suffix : '',
      total: campaign.insights.summary[v.metric[0]] || 0,
    }));
    const metricsToPrint = chartData.map((v) => ({ color: v.hoverBackgroundColor, hidden: null }));
    this.mainChartMetrics = metricsToPrint;
    return { chartData, chartLabels, type };
  }

  private groupInsightsByHourRange(groupByHour: any, chartLabels: string[]) {
    const groupByRange = {};
    chartLabels.forEach((category) => {
      if (!groupByRange[category]) {
        groupByRange[category] = [];
      }
      const splitedCategoryString = category.split('-');
      const rangeBegining = Number(splitedCategoryString[0]);
      const rangeEnd = Number(splitedCategoryString[1]);
      for (const [hourRange, values] of Object.entries(groupByHour)) {
        const hourBegining = Number(hourRange.substring(0, 2));
        if (rangeBegining <= hourBegining && hourBegining < rangeEnd) {
          groupByRange[category].push(...(values as []));
        }
      }
    });
    return groupByRange;
  }

  private calculateAvgForField(dailyInsights: any[], field: string): string {
    const sum = dailyInsights?.reduce((acc, currInsights) => {
      if (currInsights[field] !== '-') {
        acc += Number(currInsights[field]);
      }
      return acc;
    }, 0);
    return (sum / dailyInsights?.length).toFixed(2);
  }

  private getQuery(campaignForm: any): string {
    return `${getOneCampaignQuery(campaignForm.campaign.id)}&${getTimeQueryParams({
      dateRange: campaignForm.dateRange.dateRange,
    })}&provider_parameters={"breakdowns":${JSON.stringify([BreakdownTypes.hourlyRange])}}`;
  }
}
