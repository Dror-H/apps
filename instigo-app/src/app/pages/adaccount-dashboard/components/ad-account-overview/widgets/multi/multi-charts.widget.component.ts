import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { customTooltip } from '../custom-tooltip';
import { ChartOptions } from 'chart.js';
import { format } from 'date-fns';
import { versusMath } from '@app/global/utils';

export const chartLinearGradient = (canvas, height, color) => {
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `${color.start}`);
  gradient.addColorStop(1, `${color.end}`);
  return gradient;
};

@Component({
  selector: 'ingo-multi-charts',
  templateUrl: './multi-charts.widget.component.html',
  styleUrls: [`./multi-charts.widget.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiChartsWidgetComponent implements OnInit {
  @Input() adAccountInsights$: Observable<any>;
  public charts$: Observable<any>;

  private defaultOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: false,
    hover: {
      mode: 'nearest',
      intersect: false,
    },
    layout: {
      padding: {
        left: -10,
        right: 0,
        top: 2,
        bottom: -10,
      },
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
            color: '#e5e9f2',
          },
          ticks: {
            beginAtZero: true,
            fontSize: 10,
            display: false,
            stepSize: 20,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },

          ticks: {
            beginAtZero: true,
            fontSize: 11,
            display: false,
          },
        },
      ],
    },
  };

  ngOnInit(): void {
    this.charts$ = this.adAccountInsights$.pipe(
      map((result) => {
        const { type, value: adAccountInsights } = result;
        if (type === 'start') {
          return type;
        }
        const dataset = adAccountInsights.insights.data;
        const summary = adAccountInsights.insights.summary;
        const vsSummary = adAccountInsights.insights.versusSummary;
        const chartLabels = dataset.map((d) => format(new Date(d?.date), 'dd/MM/yyyy '));
        if (chartLabels.length === 0) {
          return { type: 'empty' };
        }
        if (dataset.length === 1) {
          dataset.unshift({});
          chartLabels.unshift('previous');
        }
        const uniqueCtrData: any = {
          labels: chartLabels,
          datasets: [
            {
              data: dataset.map((d) => d.uniqueCtr || 0),
              borderColor: '#20C997',
              borderWidth: 3,
              fill: true,
              pointHoverRadius: 0,
              pointHoverBorderColor: 'transparent',
              backgroundColor: () =>
                chartLinearGradient(document.getElementById('uniqueCtr'), 165, {
                  start: '#20C99710',
                  end: '#20C99701',
                }),
            },
          ],
          options: {
            ...this.defaultOptions,
            tooltips: {
              mode: 'nearest',
              intersect: false,
              enabled: false,
              custom: customTooltip,
              callbacks: {
                labelColor() {
                  return {
                    backgroundColor: '#20C997',
                    borderColor: 'transparent',
                  };
                },
              },
            },
          },
        };
        const uniqueClicksData = {
          labels: chartLabels,
          datasets: [
            {
              data: dataset.map((d) => d.uniqueClicks || 0),
              borderColor: '#FF69A5',
              borderWidth: 3,
              fill: true,
              pointHoverRadius: 0,
              pointHoverBorderColor: 'transparent',
              backgroundColor: () =>
                chartLinearGradient(document.getElementById('uniqueClicks'), 165, {
                  start: '#FF69A510',
                  end: '#FF69A501',
                }),
            },
          ],
          options: {
            ...this.defaultOptions,
            tooltips: {
              mode: 'nearest',
              intersect: false,
              enabled: false,
              custom: customTooltip,
              callbacks: {
                labelColor(tooltipItem, chart) {
                  return {
                    backgroundColor: '#FF69A5',
                    borderColor: 'transparent',
                  };
                },
              },
            },
          },
        };
        const costPerUniqueClickData: any = {
          labels: chartLabels,
          datasets: [
            {
              data: dataset.map((d) => d.costPerUniqueClick || 0),
              borderColor: '#5F63F2',
              borderWidth: 3,
              fill: true,
              pointHoverRadius: 0,
              pointHoverBorderColor: 'transparent',
              backgroundColor: () =>
                chartLinearGradient(document.getElementById('costPerUniqueClick'), 165, {
                  start: '#5F63F210',
                  end: '#5F63F201',
                }),
            },
          ],
          options: {
            ...this.defaultOptions,
            tooltips: {
              mode: 'nearest',
              intersect: false,
              enabled: false,
              custom: customTooltip,
              callbacks: {
                labelColor(tooltipItem, chart) {
                  return {
                    backgroundColor: '#5F63F2',
                    borderColor: 'transparent',
                  };
                },
              },
            },
          },
        };
        const socialSpendData: any = {
          labels: chartLabels,
          datasets: [
            {
              data: dataset.map((d) => d.socialSpend || 0),
              borderColor: '#FA8B0C',
              borderWidth: 3,
              fill: true,
              pointHoverRadius: 0,
              pointHoverBorderColor: 'transparent',
              backgroundColor: () =>
                chartLinearGradient(document.getElementById('socialSpend'), 165, {
                  start: '#FA8B0C10',
                  end: '#FA8B0C01',
                }),
            },
          ],
          options: {
            ...this.defaultOptions,
            tooltips: {
              mode: 'nearest',
              intersect: false,
              enabled: false,
              custom: customTooltip,
              callbacks: {
                labelColor(tooltipItem, chart) {
                  return {
                    backgroundColor: '#FA8B0C',
                    borderColor: 'transparent',
                  };
                },
              },
            },
          },
        };
        const charts = [
          {
            type: 'uniqueClicks',
            ...uniqueClicksData,
            metric: 'Unique Clicks',
            total: summary.uniqueClicks,
            totalLast: vsSummary.uniqueClicks,
            change: versusMath(summary.uniqueClicks, vsSummary.uniqueClicks).change,
            icon: versusMath(summary.uniqueClicks, vsSummary.uniqueClicks).icon,
          },
          {
            type: 'uniqueCtr',
            ...uniqueCtrData,
            metric: 'Unique CTR',
            total: summary.uniqueCtr,
            totalLast: vsSummary.uniqueCtr,
            change: versusMath(summary.uniqueCtr, vsSummary.uniqueCtr).change,
            icon: versusMath(summary.uniqueCtr, vsSummary.uniqueCtr).icon,
            suffix: '%',
          },
          {
            type: 'costPerUniqueClick',
            ...costPerUniqueClickData,
            metric: 'Unique CPC',
            total: summary.costPerUniqueClick,
            totalLast: vsSummary.costPerUniqueClick,
            change: versusMath(summary.costPerUniqueClick, vsSummary.costPerUniqueClick).change,
            icon: versusMath(summary.costPerUniqueClick, vsSummary.costPerUniqueClick).icon,
            prefix: '€',
          },
          {
            type: 'socialSpend',
            ...socialSpendData,
            compare: 18.3,
            metric: 'Social Spend',
            total: summary.socialSpend,
            totalLast: vsSummary.socialSpend,
            change: versusMath(summary.socialSpend, vsSummary.socialSpend).change,
            icon: versusMath(summary.socialSpend, vsSummary.socialSpend).icon,
            prefix: '€',
          },
        ];
        return { type, charts };
      }),
      catchError(() => of({ type: 'error' })),
    );
  }
}
