import { getCurrencySymbol } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CampaignDetailsService } from '@app/pages/campaign-details/campaign-details.service';
import { singularChartsOptions } from '@app/pages/campaign-details/components/chart-options';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-main-chart-widget',
  templateUrl: './main-chart.widget.component.html',
  styleUrls: [`./main-chart.widget.component.scss`],
})
export class MainChartWidgetComponent implements OnInit {
  @Input()
  adAccountInsights$: Observable<any>;

  @Input()
  chartType$ = new BehaviorSubject('bar');

  // TODO
  // Code copied from overview.component.ts to fix several issues this chart had
  // Migrate code from campaign-details.service.ts to a new shared charts.service.ts
  // Implement it in WS dashboard, adAccount dashboard and camp details view, they all share the same logic

  @ViewChild('baseChart')
  mainChartRef: BaseChartDirective;

  public mainChart: { chartData; type; chartLabels } = null;
  public mainChartOptions: any = {};
  public mainChartMetrics: { hidden: boolean; color: string }[] = [];
  public multiCharts: { chartData; type; chartLabels };
  public isCardCharts = false;
  public maxGroupBy = 0;
  public groupDataset = 0;
  public accountCurrency: BehaviorSubject<any> = new BehaviorSubject(null);

  private subSink = new SubSink();

  constructor(private campaignDetailsService: CampaignDetailsService, private analytics: AnalyticsService) {}

  ngOnInit() {
    this.mainChartOptions = singularChartsOptions(null);
    this.subSink.sink = this.adAccountInsights$
      .pipe(
        skip(1),
        map((result) => {
          const { type, value: adAccountInsights } = result;
          if (type === 'start') {
            return type;
          }
          if (result.type === 'finish') {
            this.maxGroupBy = adAccountInsights?.insights?.data?.length;
            this.groupDataset = this.campaignDetailsService.isDataGrouped({
              lengthOfData: adAccountInsights?.insights?.data?.length,
            });
            this.accountCurrency.next(adAccountInsights.currency);
            this.mainChartOptions = singularChartsOptions(getCurrencySymbol(adAccountInsights.currency, 'narrow'));
            return {
              isFinish: true,
              data: this.campaignDetailsService.buildChart(result, 0, this.chartType$.value, null, true),
            };
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
        chart: 'Main Chart',
        chartLocation: 'Ad Account Dashboard',
        toggledMetric: `ad-account-${label.toLowerCase()}`,
        toggledPrevState: updateMetrics[i].hidden,
        toggledNewState: !updateMetrics[i].hidden,
      },
    });
  }
}
