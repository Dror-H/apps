import { Inject, Injectable } from '@nestjs/common';
import { adAccountMainLineChart, simpleLineChart } from './chart-types/ad-account-main-line-chart';
import { cloneDeep, snakeCase } from 'lodash';
import * as path from 'path';
import { ThirdPartyInsightsApiService } from '@instigo-app/third-party-connector';
import { ReportsService } from './reports.service';
import { Resources } from '@instigo-app/data-transfer-object';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';

@Injectable()
export class AdAccountOverviewService {
  @Inject(ThirdPartyInsightsApiService)
  private thirdPartyInsightsApiService: ThirdPartyInsightsApiService;

  @Inject(ReportsService)
  private reportsService: ReportsService;

  assetsPath = `${path.resolve('.')}/apps/reports/src/assets`;
  temporaryPath = `${path.resolve('.')}/tmp`;

  async createAdAccountReport({ accessToken, adAccount, timeRange, user }) {
    const insights = await this.thirdPartyInsightsApiService
      .insights({
        accessToken: accessToken,
        id: [adAccount.providerId],
        provider: adAccount.provider,
        timeRange,
        type: Resources.AD_ACCOUNTS,
        params: {},
        timeIncrement: this.reportsService.sanitizeTimeIncrement(timeRange),
        paginate: true,
      })
      .pipe(map((res) => res[adAccount.providerId]))
      .toPromise();

    const summary = insights.summary;
    const dataset = insights.data;
    const lineChart = adAccountMainLineChart;
    lineChart.data.labels = dataset.map((d) => format(new Date(d?.date), 'dd/MM/yyyy '));
    lineChart.data.datasets = [
      {
        data: dataset.map((d) => d.spend),
        backgroundColor: '#7854f766',
        label: 'Spend',
        barPercentage: 0.75,
        yAxisID: 'y-axis-1',
      },
      {
        data: dataset.map((d) => d.clicks),
        backgroundColor: '#ffca0066',
        label: 'Clicks',
        barPercentage: 0.75,
        yAxisID: 'y-axis-1',
      },

      {
        data: dataset.map((d) => d.conversions),
        backgroundColor: '#7ed32166',
        label: 'Conversions',
        barPercentage: 0.75,
        yAxisID: 'y-axis-1',
      },
      {
        data: dataset.map((d) => d.cpc),
        backgroundColor: '#12a5ed66',
        label: 'CPC',
        barPercentage: 0.75,
        yAxisID: 'y-axis-2',
      },
    ];

    const impressionsChartData = cloneDeep(simpleLineChart);
    impressionsChartData.data.labels = dataset.map((d) => format(new Date(d?.date), 'dd/MM/yyyy '));
    impressionsChartData.data.datasets = [
      {
        data: dataset.map((d) => d.impressions),
        label: 'Impressions',
        borderColor: '#20C997',
        backgroundColor: 'rgb(32,201,151,0.5)',
        borderWidth: 3,
        barPercentage: 0.75,
        fill: true,
      },
    ];

    const clicksChartData = cloneDeep(simpleLineChart);
    clicksChartData.data.labels = dataset.map((d) => format(new Date(d?.date), 'dd/MM/yyyy '));
    clicksChartData.data.datasets = [
      {
        data: dataset.map((d) => d.clicks),
        label: 'Clicks',
        borderColor: '#FF69A5',
        backgroundColor: 'rgb(255,105,165,0.4)',
        borderWidth: 3,
        barPercentage: 0.75,
        fill: true,
      },
    ];

    const cpcChartData = cloneDeep(simpleLineChart);
    cpcChartData.data.labels = dataset.map((d) => format(new Date(d?.date), 'dd/MM/yyyy '));
    cpcChartData.data.datasets = [
      {
        data: dataset.map((d) => d.cpc),
        label: 'CPC',
        borderColor: '#5F63F2',
        backgroundColor: 'rgb(95,99,242,0.4)',
        borderWidth: 3,
        barPercentage: 0.75,
        fill: true,
      },
    ];

    const cpmChartData = cloneDeep(simpleLineChart);
    cpmChartData.data.labels = dataset.map((d) => format(new Date(d?.date), 'dd/MM/yyyy '));
    cpmChartData.data.datasets = [
      {
        data: dataset.map((d) => d.cpm),
        label: 'CPM',
        borderColor: '#FA8B0C',
        backgroundColor: 'rgb(250,139,12,0.4)',
        borderWidth: 3,
        barPercentage: 0.75,
        fill: true,
      },
    ];

    const payload = {
      reportName: `${snakeCase(adAccount.name)}`,
      reportTemporaryFolder: `${this.temporaryPath}/${adAccount.id}-${Date.now()}`,
      reportPugPath: `${this.assetsPath}/reports/ad-account-overview-report/ad-account-overview.pug`,
      reportVariable: { adAccount, summary, timeIntervalLabel: null },
      workspaceId: adAccount.workspace.id,
      user,
      charts: [
        {
          name: 'line.chart.js',
          data: lineChart,
        },
        {
          name: 'impressions.chart.js',
          data: impressionsChartData,
        },
        {
          name: 'clicks.chart.js',
          data: clicksChartData,
        },
        {
          name: 'cpc.chart.js',
          data: cpcChartData,
        },
        {
          name: 'cpm.chart.js',
          data: cpmChartData,
        },
      ],
    };
    return this.reportsService.buildAndShipReport(payload);
  }
}
