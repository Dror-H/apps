import { getCurrencySymbol } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { CampaignDTO } from '@instigo-app/data-transfer-object';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { map, skip, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CampaignDetailsService } from '../../campaign-details.service';
import { singularChartsOptions } from '../chart-options';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }>;

  @ViewChild('baseChart')
  mainChartRef: BaseChartDirective;

  public mainChart: { chartData; type; chartLabels } = null;
  public mainChartOptions: any = {};
  public mainChartMetrics: { hidden: boolean; color: string }[] = [];
  public multiCharts: { chartData; type; chartLabels };
  public multiChartType = 'bar';
  public isCardCharts = false;
  public maxGroupBy = 0;
  public groupDataset = 0;
  public toggleCharts = [
    {
      label: 'Switch to Line',
      icon: 'fal fa-chart-line',
      click: () => this.toggleChart('line'),
      show: true,
    },
    {
      label: 'Switch to Bar',
      icon: 'fal fa-chart-bar',
      click: () => this.toggleChart('bar'),
      show: true,
    },
    {
      label: 'Switch to Cards',
      icon: 'fal fa-chart-bar',
      click: () => this.toggleChart('cards'),
      show: true,
    },
  ];

  private subSink = new SubSink();

  constructor(public campaignDetailsService: CampaignDetailsService, private analytics: AnalyticsService) {}

  ngOnInit() {
    this.mainChartOptions = singularChartsOptions(null);
    this.subSink.sink = this.selectedCampaign$
      .pipe(
        skip(1),
        map((result) => {
          if (result.type === 'finish') {
            this.maxGroupBy = result.value.insights.data.length;
            this.groupDataset = this.campaignDetailsService.isDataGrouped({
              lengthOfData: result.value.insights.data.length,
            });
            this.mainChartOptions = singularChartsOptions(
              getCurrencySymbol(this.campaignDetailsService.campaignCurrency.getValue(), 'narrow'),
            );
            return { isFinish: true, data: this.campaignDetailsService.buildChart(result, 0, this.multiChartType) };
          } else {
            return { isFinish: false, data: this.campaignDetailsService.buildChart(result, 0) };
          }
        }),
        tap((chart) => {
          if (chart.isFinish) {
            this.mainChartMetrics = chart.data?.chartData?.map((v) => ({
              hidden: v.hidden,
              color: v.hoverBackgroundColor,
            }));
            this.mainChart = chart.data;
          } else {
            this.multiCharts = chart.data;
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public updateData(): void {
    this.mainChart = this.campaignDetailsService.buildChart(this.selectedCampaign$.value, this.groupDataset, true);
    this.multiCharts = this.campaignDetailsService.buildChart(this.selectedCampaign$.value, 0);
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
        chart: 'Overview',
        chartLocation: 'Campaign Details',
        toggledMetric: `${this.selectedCampaign$.value.value.provider}-${label.toLowerCase()}`,
        toggledPrevState: updateMetrics[i].hidden,
        toggledNewState: !updateMetrics[i].hidden,
      },
    });
  }

  private toggleChart(type): void {
    this.analytics.sendEvent({
      event: 'Chart',
      action: 'change_type',
      data: {
        event: 'Chart',
        chart: 'Overview',
        chartLocation: 'Campaign Details',
        prevType: this.isCardCharts ? 'cards' : this.multiChartType,
        newType: type,
      },
    });
    if (type !== 'cards') {
      this.isCardCharts = false;
      this.multiChartType = type;
    } else {
      this.isCardCharts = true;
      this.updateData();
    }
  }
}
