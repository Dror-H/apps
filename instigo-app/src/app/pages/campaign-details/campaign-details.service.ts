import { getCurrencySymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { getConversionRelatedFields } from '@instigo-app/data-transfer-object';
import { getOneCampaignQuery } from '@app/global/get-one-campaign-query';
import { getTimeQueryParams } from '@app/global/get-time-query-params';
import { getEngagementFields, versusMath } from '@app/global/utils';
import { CampaignDTO, Metrics } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { endOfToday, format, getISODay, parseJSON, startOfToday } from 'date-fns';
import { chunk, groupBy } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  metricsForAdAcountChart,
  metricsForDailyBreakdownChart,
  metricsForFacebookEngagementChart,
  metricsForLinkedinEngagementChart,
  metricsForLinkedinPeformanceChart,
  metricsForLTPeformanceChart,
  metricsForMainChart,
  multiChartsOptions,
} from './components/chart-options';
import { chartLinearGradient, customTooltip } from './components/utils';
@Injectable()
export class CampaignDetailsService {
  public campaignCurrency = new BehaviorSubject<string>(null);
  constructor() {}

  getCampaignQuery(campaignForm: any) {
    return `${getOneCampaignQuery(campaignForm.campaign.id)}&${getTimeQueryParams({
      dateRange: campaignForm.dateRange.dateRange,
    })}
    &time_increment=daily&provider_parameters={ "versus":true, "fields": ["social_spend", "actions"] }&`;
  }

  getAdSetsAdsQuery(campaignForm: any, campaignId: any) {
    const query = RequestQueryBuilder.create();
    query.setLimit(0);
    query.setFilter({
      field: 'campaign.id',
      operator: CondOperator.IN,
      value: campaignId,
    });
    query.sortBy({ field: 'updatedAt', order: 'DESC' });
    return `${query.query()}&time_increment=all&${getTimeQueryParams({
      dateRange: campaignForm.value.dateRange.dateRange,
    })}
    &provider_parameters={ "versus":true, "fields": ["social_spend", "actions"] }`;
  }

  getLinkedInDailyQuery(campaignId: any) {
    const query = RequestQueryBuilder.create();
    const dateRange = { start: startOfToday(), end: endOfToday() };
    query.sortBy({ field: 'updatedAt', order: 'DESC' });
    return `${getOneCampaignQuery(campaignId)}&${getTimeQueryParams({ dateRange: dateRange })}`;
  }

  buildChart(result, groupDataBy, isMain?, subType?, isAdAccount?: boolean): { type; chartData; chartLabels } {
    const { type, value: selectedCampaign } = result;
    if (type === 'start') {
      return type;
    }
    if (!selectedCampaign || !selectedCampaign.insights) {
      return { type, chartData: null, chartLabels: null };
    }
    const dailyBreakdown = selectedCampaign.insights.data;
    const summary = {
      ...selectedCampaign.insights.summary,
      ...this.providerSpecificFields(
        selectedCampaign.insights.summary,
        selectedCampaign.actionTypeField,
        selectedCampaign.provider,
      ),
    };
    const vsSummary = {
      ...selectedCampaign.insights.versusSummary,
      ...getConversionRelatedFields(selectedCampaign.insights.versusSummary, selectedCampaign.actionTypeField),
      ...getEngagementFields(selectedCampaign.insights.versusSummary),
    };
    if (subType && subType === 'dailyBreakdowns') {
      const dataset = this.datasetForBreakdowns(dailyBreakdown, metricsForDailyBreakdownChart);
      const chartLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const chartData = this.prepChartData(
        dataset,
        summary,
        vsSummary,
        chartLabels,
        isMain,
        subType,
        selectedCampaign.provider,
      );
      return { chartData, chartLabels, type };
    }
    const datasetAll = this.dataset(dailyBreakdown, selectedCampaign.actionTypeField, selectedCampaign.provider);
    const dataset = isAdAccount ? datasetAll : this.shouldDataGroup(datasetAll, isMain, groupDataBy);
    const chartLabels = dataset.map((d) => d.label);
    const currency = (selectedCampaign as CampaignDTO)?.adAccount?.currency
      ? (selectedCampaign as CampaignDTO).adAccount.currency
      : selectedCampaign.currency;
    const chartData = this.prepChartData(
      dataset,
      summary,
      vsSummary,
      chartLabels,
      isMain,
      subType,
      selectedCampaign.provider,
      isAdAccount,
      getCurrencySymbol(currency, 'narrow'),
    );
    return { chartData, chartLabels, type };
  }

  shouldDataGroup(dataToCheck, isMain, groupDataBy) {
    if (dataToCheck.length > 8 && isMain && isMain !== 'line') {
      if (groupDataBy > 0) {
        return this.groupData(dataToCheck, groupDataBy);
      } else {
        return this.groupData(dataToCheck, Math.ceil(dataToCheck.length / 8));
      }
    } else {
      return dataToCheck;
    }
  }

  isDataGrouped({ lengthOfData }) {
    return lengthOfData > 8 ? Math.ceil(lengthOfData / 8) : 1;
  }

  whichMetricsToUse(provider, subType?, isAdAccount?) {
    let whichMetrics;
    if (isAdAccount) {
      whichMetrics = metricsForAdAcountChart;
      return whichMetrics;
    }
    if (subType) {
      if (subType === 'lifetimePerformance') {
        whichMetrics = provider === 'linkedin' ? metricsForLinkedinPeformanceChart : metricsForLTPeformanceChart;
      } else if (subType === 'linkedinEngagement') {
        whichMetrics = metricsForLinkedinEngagementChart;
      } else {
        whichMetrics = metricsForDailyBreakdownChart;
      }
    } else {
      whichMetrics = metricsForMainChart;
    }
    return whichMetrics;
  }

  prepChartData(rawData, summaryData, vsSummaryData, chartLabels, isMain, subType, provider, isAdAccount?, currency?) {
    if (isMain) {
      const dataSets = this.whichMetricsToUse(provider, subType, isAdAccount).map((v) => ({
        data: subType ? rawData[v.metric[0]] : rawData.map((d) => d[v.metric[0]]),
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
      }));
      return dataSets;
    } else {
      const dataSets = this.whichMetricsToUse(provider, subType).map((v) => ({
        type: v.metric[0],
        metric: v.metric[1],
        total: summaryData[v.metric[0]] || 0,
        change: versusMath(summaryData[v.metric[0]], vsSummaryData[v.metric[0]]).change,
        icon: versusMath(summaryData[v.metric[0]], vsSummaryData[v.metric[0]]).icon,
        labels: chartLabels,
        prefix: v.prefix ? v.prefix : '',
        suffix: v.suffix ? v.suffix : '',
        datasets: [
          {
            data: rawData.map((d) => d[v.metric[0]]),
            borderColor: v.gradient[0],
            borderWidth: 3,
            fill: true,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: v.gradient[0],
            pointHoverBorderWidth: 0,
            pointHoverBorderColor: 'transparent',
            backgroundColor: () =>
              chartLinearGradient(document.getElementById(v.metric[0]), 160, {
                start: v.gradient[1],
                end: v.gradient[2],
              }),
          },
        ],
        options: {
          ...multiChartsOptions,
          tooltips: {
            mode: 'nearest',
            intersect: false,
            enabled: false,
            custom: customTooltip,
            callbacks: {
              labelColor(tooltipItem, chart) {
                return {
                  backgroundColor: v.gradient[0],
                  borderColor: 'transparent',
                };
              },
              beforeLabel(tooltipItem, chart) {
                return v.prefix && v.prefix === 'currency' ? currency : '';
              },
            },
          },
        },
      }));
      return dataSets;
    }
  }

  prepEngagementCharts(rawData, summaryData, vsSummaryData, chartLabels) {
    const dataSets = metricsForFacebookEngagementChart.map((v) => ({
      type: v.metric[0],
      metric: v.metric[1],
      total: summaryData[v.metric[0]] || 0,
      change: versusMath(summaryData[v.metric[0]], vsSummaryData[v.metric[0]]).change,
      icon: versusMath(summaryData[v.metric[0]], vsSummaryData[v.metric[0]]).icon,
      labels: chartLabels,
      datasets: [
        {
          data: rawData.map((d) => d[v.metric[0]]),
          borderColor: v.gradient[0],
          borderWidth: 3,
          fill: true,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: v.gradient[0],
          pointHoverBorderWidth: 0,
          pointHoverBorderColor: 'transparent',
          backgroundColor: () =>
            chartLinearGradient(document.getElementById(v.metric[0]), 160, {
              start: v.gradient[1],
              end: v.gradient[2],
            }),
        },
      ],
      options: {
        ...multiChartsOptions,
        tooltips: {
          mode: 'nearest',
          intersect: false,
          enabled: false,
          custom: customTooltip,
          callbacks: {
            labelColor(tooltipItem, chart) {
              return {
                backgroundColor: v.gradient[0],
                borderColor: 'transparent',
              };
            },
            beforeLabel(tooltipItem, chart) {
              return v.prefix ? v.prefix : '';
            },
          },
        },
      },
    }));
    return dataSets;
  }

  dataset(dailyBreakdown: any[], actionTypeField: string, provider: string): any[] {
    return dailyBreakdown.map((d: Metrics) => ({
      label: format(parseJSON(d.date), 'dd/MM'),
      spend: d.spend,
      clicks: d.clicks,
      cpc: d.cpc,
      impressions: d.impressions,
      ctr: d.ctr,
      cpm: d.cpm,
      frequency: d.frequency,
      reach: d.reach,
      socialSpend: d.socialSpend,
      ...this.providerSpecificFields(d, actionTypeField, provider),
    }));
  }

  providerSpecificFields(data: any, actionTypeField: string, provider: string) {
    if (provider === 'linkedin') {
      return {
        conversions: data.conversions,
        conversionRate: data.conversionsRate / data.clicks,
        cpa: data.cpa,
        totalEngagements: data.totalEngagements,
        otherEngagements: data.otherEngagements,
        engagementRate: data.engagementRate,
        likes: data.likes,
        comments: data.comments,
        follows: data.follows,
        shares: data.shares,
      };
    } else {
      return {
        ...getConversionRelatedFields(data, actionTypeField),
        ...getEngagementFields(data),
      };
    }
  }

  datasetForBreakdowns(insightsEntry, fieldsToProcess) {
    const insightsGroupedByWeekDay = groupBy(insightsEntry, (insights) => getISODay(new Date(insights.date)));
    return fieldsToProcess.reduce(
      (a, c) => ((a[c.metric[0]] = this.calculateDailyAvgForField(insightsGroupedByWeekDay, c.metric[0])), a),
      {},
    );
  }

  calculateDailyAvgForField(insightsGroupedByWeekDay: any, field: string) {
    const dailyResults = [];
    for (const [day, dayInsights] of Object.entries(insightsGroupedByWeekDay)) {
      dailyResults.splice(Number(day), 0, this.calculateAvgForField(dayInsights as [], field));
    }
    return dailyResults;
  }

  calculateAvgForField(dailyInsights: any[], field: string) {
    const sum = dailyInsights?.reduce((acc, currInsights) => acc + Number(currInsights[field]), 0);
    return (sum / dailyInsights?.length).toFixed(2);
  }

  groupData(checkedData: any, groupEvery: number) {
    return chunk(checkedData, groupEvery).map((d: any) => ({
      label: d[0].label + ' - ' + d[d.length - 1].label,
      spend: d.reduce((a, c) => a + c.spend, 0).toFixed(2),
      clicks: d.reduce((a, c) => a + c.clicks, 0),
      cpc: d.reduce((a, c) => a + c.cpc, 0).toFixed(2) / groupEvery,
      impressions: d.reduce((a, c) => a + c.impressions, 0),
      ctr: d.reduce((a, c) => a + c.ctr, 0).toFixed(2) / groupEvery,
      conversions: d.reduce((a, c) => a + c.conversions, 0).toFixed(2),
      conversionRate: d.reduce((a, c) => a + c.conversionRate, 0).toFixed(2) / groupEvery,
      cpa: d.reduce((a, c) => a + c.cpa, 0).toFixed(2) / groupEvery,
      cpm: d.reduce((a, c) => a + c.cpm, 0).toFixed(2) / groupEvery,
    }));
  }
}
