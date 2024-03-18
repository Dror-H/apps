import { Component, Input, OnInit } from '@angular/core';
import { CampaignDTO } from '@instigo-app/data-transfer-object';
import { format } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { multiChartsOptions } from '../chart-options';
import { chartLinearGradient, customTooltip } from '../utils';

@Component({
  selector: 'app-engagement-metrics',
  templateUrl: './engagement-metrics.component.html',
  styleUrls: ['./engagement-metrics.component.scss'],
})
export class EngagementMetricsComponent implements OnInit {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }> = new BehaviorSubject(null);

  public charts$: Observable<{ charts; type }>;
  public defaultOptions = multiChartsOptions;

  ngOnInit() {
    this.charts$ = this.selectedCampaign$.pipe(
      skip(1),
      map((result) => this.buildChart(result)),
    );
  }

  private buildChart(result): { type; charts } {
    const { type, value: selectedCampaign } = result;
    if (type === 'start') {
      return type;
    }
    if (!selectedCampaign || !selectedCampaign.insights) {
      return { type, charts: null };
    }

    const summary = this.datasetSummary(selectedCampaign.insights);
    const dataset = this.datasetDailyBreakdown(selectedCampaign.insights);
    const chartLabels = dataset.map((d) => format(new Date(d?.label), 'dd/MM/yyyy '));

    const likesData: any = {
      labels: chartLabels,
      datasets: [
        {
          data: dataset.map((d) => d.likes),
          borderColor: '#20C997',
          borderWidth: 3,
          fill: true,
          pointHoverRadius: 0,
          pointHoverBorderColor: 'transparent',
          backgroundColor: () =>
            chartLinearGradient(document.getElementById('likes'), 165, {
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
    const commentsData = {
      labels: chartLabels,
      datasets: [
        {
          data: dataset.map((d) => d.comments),
          borderColor: '#FF69A5',
          borderWidth: 3,
          fill: true,
          pointHoverRadius: 0,
          pointHoverBorderColor: 'transparent',
          backgroundColor: () =>
            chartLinearGradient(document.getElementById('comments'), 165, {
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

    const postReactionsData: any = {
      labels: chartLabels,
      datasets: [
        {
          data: dataset.map((d) => d.postReactions),
          borderColor: '#5F63F2',
          borderWidth: 3,
          fill: true,
          pointHoverRadius: 0,
          pointHoverBorderColor: 'transparent',
          backgroundColor: () =>
            chartLinearGradient(document.getElementById('postReactions'), 165, {
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
    const sharesData: any = {
      labels: chartLabels,
      datasets: [
        {
          data: dataset.map((d) => d.shares),
          borderColor: '#FA8B0C',
          borderWidth: 3,
          fill: true,
          pointHoverRadius: 0,
          pointHoverBorderColor: 'transparent',
          backgroundColor: () =>
            chartLinearGradient(document.getElementById('shares'), 165, {
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
        type: 'likes',
        ...likesData,
        compare: 14.2,
        icon: 'up',
        metric: 'Page likes',
        total: summary.likes,
        totalLast: '20,192',
      },
      {
        type: 'comments',
        ...commentsData,
        compare: 11.92,
        icon: 'up',
        metric: 'Comments',
        total: summary.comments,
        totalLast: '20,192',
      },
      {
        type: 'postReactions',
        ...postReactionsData,
        compare: 7.82,
        icon: 'down',
        metric: 'Post reactions',
        total: summary.postReactions,
        totalLast: '18,482',
      },
      {
        type: 'shares',
        ...sharesData,
        compare: 18.3,
        icon: 'up',
        metric: 'Shares',
        total: summary.shares,
        totalLast: '11,485',
      },
    ];
    return { charts, type };
  }

  private datasetDailyBreakdown(insights) {
    this.mapEngagementsInDailyBreakdown(insights, 'likes', 'like');
    this.mapEngagementsInDailyBreakdown(insights, 'comments', 'comment');
    this.mapEngagementsInDailyBreakdown(insights, 'shares', 'post');
    this.mapPostReactionsInDailyBreakdown(insights);
    return insights.data.map((d) => ({
      label: d.date,
      likes: d.likes,
      shares: d.shares,
      comments: d.comments,
      postReactions: d.postReactions,
    }));
  }

  private datasetSummary(insights) {
    this.mapActionInSummary(insights, 'likes', 'like');
    this.mapActionInSummary(insights, 'comments', 'comment');
    this.mapActionInSummary(insights, 'shares', 'post');
    this.mapPostReactionsInSummary(insights);
    return insights.summary;
  }

  private mapActionInSummary(insights, fieldInSummary, actionType) {
    if (insights && insights.summary) {
      insights.summary[fieldInSummary] =
        insights.summary.actions?.find((action) => action?.actionType === actionType)?.value || 0;
    }
  }

  private mapPostReactionsInSummary(insights) {
    let postReactions = 0;
    if (insights && insights.summary) {
      insights.summary.actions?.forEach((action) => {
        if (
          action?.actionType === 'post_reaction' &&
          (action?.actionReaction === 'like' ||
            action?.actionReaction === 'wow' ||
            action?.actionReaction === 'love' ||
            action?.actionReaction === 'haha')
        ) {
          postReactions += Number(action.value);
        }
      });
      insights.summary.postReactions = postReactions;
    }
  }

  private mapEngagementsInDailyBreakdown(insights, field, actionType) {
    if (insights && insights.data) {
      insights.data.map((dailyInsights) => {
        dailyInsights[field] =
          Number(dailyInsights.actions?.find((action) => action?.actionType === actionType)?.value) || 0;
      });
    }
  }

  private mapPostReactionsInDailyBreakdown(insights) {
    if (insights && insights.data) {
      insights.data.map((dailyInsights) => {
        let postReactions = 0;
        dailyInsights.actions?.forEach((action) => {
          if (
            action?.actionType === 'post_reaction' &&
            (action?.actionReaction === 'like' ||
              action?.actionReaction === 'wow' ||
              action?.actionReaction === 'love' ||
              action?.actionReaction === 'haha')
          ) {
            postReactions += Number(action.value);
          }
        });
        dailyInsights.postReactions = postReactions;
      });
    }
  }
}
