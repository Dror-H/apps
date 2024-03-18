import { getCurrencySymbol } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { singularChartsOptions } from '@app/pages/campaign-details/components/chart-options';
import { versusMath } from '@app/global/utils';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { ObservableType } from '@instigo-app/data-transfer-object';
import { Metrics } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { format } from 'date-fns';
import { chunk } from 'lodash-es';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { filter, map, skip } from 'rxjs/operators';
import { mainChartMetrics } from '../../workspace-dashboard-utils';

@Component({
  selector: 'ingo-workspace-widget-insights-cards',
  templateUrl: './insights-cards.component.html',
  styleUrls: ['./insights-cards.component.scss'],
})
export class InsightsCardsComponent implements OnInit {
  @Input()
  workspaceInsights$: BehaviorSubject<any> = new BehaviorSubject(null);

  @Select(WorkspaceState.defaultCurrency)
  public defaultCurrency$: Observable<string>;

  @SelectSnapshot(WorkspaceState.defaultCurrency)
  public defaultCurrency: string;

  @ViewChild('baseChart')
  mainChartRef: BaseChartDirective;

  public availableMetrics: any[];
  public mainChart$: BehaviorSubject<{ chartData; type; chartLabels }> = new BehaviorSubject(null);
  public mainChartOptions: any = {};
  public mainChartMetrics: { hidden: boolean; color: string }[] = [];
  public isCardCharts = false;
  public maxGroupBy = 0;
  public groupDataset = 0;
  public metricsForMainChart: mainChartMetrics[] = [
    {
      metric: ['spend', 'Spend'],
      axis: 'actionsSmall',
      colors: ['#7854f766', '#7854f7'],
      gradient: ['#7854f7', '#7854f70f', '#7854f701'],
      special: 'currency',
      prefix: 'currency',
    },
    {
      metric: ['clicks', 'Clicks'],
      axis: 'actionsSmall',
      colors: ['#ffca0066', '#ffca00'],
      gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
      special: 'bigNumber',
    },
    {
      metric: ['cpc', 'Cost per Click'],
      axis: 'cost',
      colors: ['#12a5ed66', '#12a5ed'],
      gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
      special: 'currency',
      prefix: 'currency',
    },
    {
      metric: ['frequency', 'Frequency'],
      axis: 'actionsSmall',
      colors: ['#7ed32166', '#7ed321'],
      gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
    },
    {
      metric: ['reach', 'Reach'],
      axis: 'actionsLarge',
      colors: ['#ff840066', '#ff8400'],
      gradient: ['#ff8400', '#ff84000f', '#ff840001'],
      special: 'bigNumber',
    },
    {
      metric: ['impressions', 'Impressions'],
      axis: 'actionsLarge',
      colors: ['#f5325b66', '#f5325b'],
      gradient: ['#f5325b', '#f5325b0f', '#f5325b01'],
      hidden: true,
      special: 'bigNumber',
    },
    {
      metric: ['ctr', 'Click Through Rate'],
      axis: 'percentage',
      colors: ['#ff69a566', '#ff69a5'],
      gradient: ['#ff69a5', '#ff69a50f', '#ff69a501'],
      hidden: true,
      suffix: '%',
    },
    {
      metric: ['cpm', 'Cost per 1k Views'],
      axis: 'cost',
      colors: ['#5f63f266', '#5f63f2'],
      gradient: ['#5f63f2', '#5f63f20f', '#5f63f201'],
      special: 'currency',
      hidden: true,
      prefix: 'currency',
    },
  ];

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.mainChartOptions = singularChartsOptions(null);
    this.mainChartOptions.scales.xAxes[0].ticks.maxTicksLimit = 7;
    this.workspaceInsights$
      .pipe(
        skip(1),
        filter((data) => data.type === ObservableType.FINISH),
        map((result) => result),
        map((result) => {
          this.maxGroupBy = result.value?.data?.length;
          this.groupDataset = this.maxGroupBy > 6 ? Math.ceil(this.maxGroupBy / 6) : 1;
          this.mainChartOptions = singularChartsOptions(getCurrencySymbol(this.defaultCurrency, 'narrow'));
          this.mainChartOptions.scales.xAxes[0].ticks.maxTicksLimit = 7;
          return this.buildChart(result, 0);
        }),
      )
      .subscribe((result) => {
        this.mainChartMetrics = result?.chartData?.map((v) => ({
          hidden: v.hidden,
          color: v.hoverBackgroundColor,
        }));
        this.mainChart$.next(result);
      });
  }

  public updateData(): void {
    this.mainChart$.next(this.buildChart(this.workspaceInsights$.value, this.groupDataset));
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
      action: 'change_metric',
      data: {
        event: 'Chart',
        chart: 'Insights Cards',
        chartLocation: 'Workspace Dashboard',
        toggledMetric: `workspace-${label.toLowerCase()}`,
        toggledPrevState: updateMetrics[i].hidden,
        toggledNewState: !updateMetrics[i].hidden,
      },
    });
  }

  private buildChart(result, groupDataBy): { type; chartData; chartLabels } {
    const { type, value: insightsData } = result;
    if (type === 'start') {
      return type;
    }
    if (!insightsData) {
      return { type, chartData: null, chartLabels: null };
    }
    const dailyBreakdown = insightsData.data;
    const summary = insightsData.summary;
    const vsSummary = insightsData.versusSummary;
    const datasetAll = this.dataset(dailyBreakdown);
    const dataset = this.shouldDataGroup(datasetAll, groupDataBy);
    const chartLabels = dataset.map((d) => d.label);
    const chartData = this.prepChartData(dataset, summary, vsSummary);
    return { chartData, chartLabels, type };
  }

  private shouldDataGroup(dataToCheck, groupDataBy) {
    if (dataToCheck.length > 8) {
      if (groupDataBy > 0) {
        return this.groupData(dataToCheck, groupDataBy);
      } else {
        return this.groupData(dataToCheck, Math.ceil(dataToCheck.length / 8));
      }
    } else {
      return dataToCheck;
    }
  }

  private dataset(dailyBreakdown: any[]): any[] {
    return dailyBreakdown.map((d: Metrics) => ({
      label: format(new Date(d.date), 'dd/MM/yy'),
      spend: d.spend,
      clicks: d.clicks,
      cpc: d.cpc,
      impressions: d.impressions,
      ctr: d.ctr,
      cpm: d.cpm,
      frequency: d.frequency,
      reach: d.reach,
      socialSpend: d.socialSpend,
    }));
  }

  private groupData(checkedData: any, groupEvery: number) {
    return chunk(checkedData, groupEvery).map((d: any) => {
      const labelStart = d[0].label.substr(0, d[0].label.lastIndexOf('/'));
      const labelEnd = d[d.length - 1].label.substr(0, d[d.length - 1].label.lastIndexOf('/'));
      return {
        label: labelStart + ' - ' + labelEnd,
        spend: d.reduce((a, c) => a + c.spend, 0).toFixed(2),
        clicks: d.reduce((a, c) => a + c.clicks, 0),
        cpc: d.reduce((a, c) => a + c.cpc, 0).toFixed(2) / groupEvery,
        impressions: d.reduce((a, c) => a + c.impressions, 0),
        ctr: d.reduce((a, c) => a + c.ctr, 0).toFixed(2) / groupEvery,
        cpm: d.reduce((a, c) => a + c.cpm, 0).toFixed(2),
        frequency: d.reduce((a, c) => a + c.frequency, 0).toFixed(2) / groupEvery,
        reach: d.reduce((a, c) => a + c.reach, 0).toFixed(2) / groupEvery,
        socialSpend: d.reduce((a, c) => a + c.socialSpend, 0).toFixed(2) / groupEvery,
      };
    });
  }

  private prepChartData(rawData, summaryData, vsSummaryData) {
    const dataSets = this.metricsForMainChart.map((v) => ({
      data: rawData.map((d) => d[v.metric[0]]),
      backgroundColor: v.colors[0],
      hoverBackgroundColor: v.colors[1],
      label: v.metric[1],
      yAxisID: v.axis,
      barPercentage: 0.8,
      prefix: v.prefix ? v.prefix : '',
      suffix: v.suffix ? v.suffix : '',
      hidden: v.hidden,
      total: summaryData[v.metric[0]] || 0,
      change: versusMath(summaryData[v.metric[0]], vsSummaryData[v.metric[0]]).change,
      icon: versusMath(summaryData[v.metric[0]], vsSummaryData[v.metric[0]]).icon,
      special: v.special,
    }));
    return dataSets;
  }
}
