import { customTooltip } from './utils';

export const metricsForAdAcountChart = [
  {
    metric: ['spend', 'Spend'],
    axis: 'costLarge',
    colors: ['#7854f766', '#7854f7'],
    gradient: ['#7854f7', '#7854f70f', '#7854f701'],
    prefix: 'currency',
  },
  {
    metric: ['clicks', 'Clicks'],
    axis: 'actionsSmall',
    colors: ['#ffca0066', '#ffca00'],
    gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
  },
  {
    metric: ['cpc', 'Cost per Click'],
    axis: 'cost',
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
    prefix: 'currency',
  },
  {
    metric: ['reach', 'Reach'],
    axis: 'actionsLarge',
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
  },
  {
    metric: ['frequency', 'Frequency'],
    axis: 'actionsSmall',
    colors: ['#ff840066', '#ff8400'],
    gradient: ['#ff8400', '#ff84000f', '#ff840001'],
  },
  {
    metric: ['impressions', 'Impressions'],
    axis: 'actionsLarge',
    colors: ['#f5325b66', '#f5325b'],
    gradient: ['#f5325b', '#f5325b0f', '#f5325b01'],
    hidden: true,
  },
  {
    metric: ['ctr', 'Click Through Rate'],
    axis: 'percentage',
    colors: ['#ff69a566', '#ff69a5'],
    gradient: ['#ff69a5', '#ff69a50f', '#ff69a501'],
    suffix: '%',
    hidden: true,
  },
  {
    metric: ['cpm', 'Cost per 1k Views'],
    axis: 'cost',
    colors: ['#5f63f266', '#5f63f2'],
    gradient: ['#5f63f2', '#5f63f20f', '#5f63f201'],
    prefix: 'currency',
    hidden: true,
  },
];

export const metricsForHourlyBreakdownChart = [
  {
    metric: ['clicks', 'Clicks'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
    axis: 'actionsLarge',
  },
  {
    metric: ['cpc', 'Cost per Click'],
    colors: ['#ff840066', '#ff8400'],
    gradient: ['#ff8400', '#ff84000f', '#ff840001'],
    prefix: 'currency',
    axis: 'cost',
  },
  {
    metric: ['impressions', 'Impressions'],
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
    axis: 'actionsLarge',
  },
  {
    metric: ['ctr', 'Click Through Rate'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
    axis: 'percentage',
    suffix: '%',
  },
  // {
  //   metric: ['cpm', 'Cost per 1k Views'],
  //   colors: ['#5f63f266', '#5f63f2'],
  //   gradient: ['#5f63f2', '#5f63f20f', '#5f63f201'],
  //   prefix: '€',
  //   axis: 'cost',
  // },
];
export const metricsForDailyBreakdownChart = [
  {
    metric: ['clicks', 'Clicks'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
    axis: 'actionsLarge',
  },
  {
    metric: ['cpc', 'Cost per Click'],
    colors: ['#ff840066', '#ff8400'],
    gradient: ['#ff8400', '#ff84000f', '#ff840001'],
    prefix: 'currency',
    axis: 'cost',
  },
  {
    metric: ['impressions', 'Impressions'],
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
    axis: 'actionsLarge',
  },
  {
    metric: ['cpm', 'Cost per 1k Views'],
    colors: ['#5f63f266', '#5f63f2'],
    gradient: ['#5f63f2', '#5f63f20f', '#5f63f201'],
    prefix: 'currency',
    axis: 'cost',
  },
];
export const metricsForLTPeformanceChart = [
  {
    metric: ['reach', 'People Reached'],
    colors: ['#7854f766', '#7854f7'],
    gradient: ['#7854f7', '#7854f70f', '#7854f701'],
  },
  {
    metric: ['frequency', 'Frequency'],
    colors: ['#ffca0066', '#ffca00'],
    gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
  },
  {
    metric: ['socialSpend', 'Social Spend'],
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
    prefix: 'currency',
  },
  {
    metric: ['postEngagements', 'Engagements'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
  },
];
export const metricsForLinkedinPeformanceChart = [
  {
    metric: ['reach', 'People Reached'],
    colors: ['#7854f766', '#7854f7'],
    gradient: ['#7854f7', '#7854f70f', '#7854f701'],
  },
  {
    metric: ['frequency', 'Frequency'],
    colors: ['#ffca0066', '#ffca00'],
    gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
    suffix: '%',
  },
  {
    metric: ['totalEngagements', 'Engagements'],
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
  },
  {
    metric: ['engagementRate', 'Engagement Rate'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
    suffix: '%',
  },
];
export const metricsForMainChart = [
  {
    metric: ['spend', 'Spend'],
    axis: 'actionsSmall',
    colors: ['#7854f766', '#7854f7'],
    gradient: ['#7854f7', '#7854f70f', '#7854f701'],
    prefix: 'currency',
  },
  {
    metric: ['clicks', 'Clicks'],
    axis: 'actionsSmall',
    colors: ['#ffca0066', '#ffca00'],
    gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
  },
  {
    metric: ['cpc', 'Cost per Click'],
    axis: 'cost',
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
    prefix: 'currency',
  },
  {
    metric: ['conversions', 'Conversions'],
    axis: 'actionsSmall',
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
  },
  {
    metric: ['cpa', 'Cost per Conversion'],
    axis: 'cost',
    colors: ['#ff840066', '#ff8400'],
    gradient: ['#ff8400', '#ff84000f', '#ff840001'],
    prefix: 'currency',
  },
  {
    metric: ['impressions', 'Impressions'],
    axis: 'actionsLarge',
    colors: ['#f5325b66', '#f5325b'],
    gradient: ['#f5325b', '#f5325b0f', '#f5325b01'],
    hidden: true,
  },
  {
    metric: ['ctr', 'Click Through Rate'],
    axis: 'percentage',
    colors: ['#ff69a566', '#ff69a5'],
    gradient: ['#ff69a5', '#ff69a50f', '#ff69a501'],
    suffix: '%',
    hidden: true,
  },
  {
    metric: ['cpm', 'Cost per 1k Views'],
    axis: 'cost',
    colors: ['#5f63f266', '#5f63f2'],
    gradient: ['#5f63f2', '#5f63f20f', '#5f63f201'],
    prefix: 'currency',
    hidden: true,
  },
];
export const metricsForFacebookEngagementChart = [
  {
    metric: ['likes', 'Page Likes'],
    colors: ['#7854f766', '#7854f7'],
    gradient: ['#7854f7', '#7854f70f', '#7854f701'],
  },
  {
    metric: ['comments', 'Post Comments'],
    colors: ['#ffca0066', '#ffca00'],
    gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
  },
  {
    metric: ['postReactions', 'Post Reactions'],
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
    prefix: '€',
  },
  {
    metric: ['shares', 'Post Shares'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
  },
];
export const metricsForLinkedinEngagementChart = [
  {
    metric: ['likes', 'Likes'],
    colors: ['#7854f766', '#7854f7'],
    gradient: ['#7854f7', '#7854f70f', '#7854f701'],
  },
  {
    metric: ['comments', 'Comments'],
    colors: ['#ffca0066', '#ffca00'],
    gradient: ['#ffca00', '#ffca000f', '#ffca0001'],
  },
  {
    metric: ['follows', 'Follows'],
    colors: ['#12a5ed66', '#12a5ed'],
    gradient: ['#12a5ed', '#12a5ed0f', '#12a5ed01'],
  },
  {
    metric: ['shares', 'Shares'],
    colors: ['#7ed32166', '#7ed321'],
    gradient: ['#7ed321', '#7ed3210f', '#7ed32101'],
  },
];

export const singularChartsOptions = (currency) => ({
  scaleShowVerticalLines: false,
  maintainAspectRatio: true,
  responsive: true,
  legend: {
    display: false,
  },
  layout: {
    padding: {
      left: '0',
      right: 0,
      top: 0,
      bottom: '0',
    },
  },
  tooltips: {
    mode: 'label',
    intersect: false,
    position: 'average',
    enabled: false,
    custom: customTooltip,
    callbacks: {
      label(t, d) {
        const dstLabel = d.datasets[t.datasetIndex].label;
        const { yLabel } = t;
        const suffix = d.datasets[t.datasetIndex]?.suffix || '';
        const total =
          d.datasets[t.datasetIndex]?.yAxisID === ('cost' || 'costLarge' || 'percentage')
            ? yLabel.toFixed(2)
            : yLabel.toLocaleString();
        return `<span class="chart-data">${total}</span>${suffix} <span class="data-label">${dstLabel}</span>`;
      },
      labelColor(tooltipItem, chart) {
        const dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
        return {
          backgroundColor: dataset.hoverBackgroundColor,
          borderColor: 'transparent',
          usePointStyle: true,
        };
      },
      beforeLabel(tooltipItem, chart) {
        const dataset = chart.datasets[tooltipItem.datasetIndex];
        return dataset?.prefix === 'currency' ? currency : '';
      },
    },
  },
  scales: {
    yAxes: [
      {
        id: 'cost',
        type: 'linear',
        display: 'auto',
        position: 'left',
        gridLines: {
          color: '#e5e9f2',
          borderDash: [3, 3],
          zeroLineColor: '#e5e9f2',
          zeroLineWidth: 1,
          zeroLineBorderDash: [3, 3],
        },
        ticks: {
          callback: (v) => currency + v,
        },
      },
      {
        id: 'costLarge',
        type: 'linear',
        display: 'auto',
        position: 'left',
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [3, 3],
          zeroLineColor: '#e5e9f2',
          zeroLineWidth: 1,
          zeroLineBorderDash: [3, 3],
        },
        ticks: {
          callback: (v) => currency + v,
        },
      },
      {
        id: 'actionsSmall',
        type: 'linear',
        display: 'auto',
        position: 'right',
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [3, 3],
          zeroLineColor: '#e5e9f2',
          zeroLineWidth: 1,
          zeroLineBorderDash: [3, 3],
        },
      },
      {
        id: 'actionsLarge',
        type: 'linear',
        display: 'auto',
        position: 'right',
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [3, 3],
          zeroLineColor: '#e5e9f2',
          zeroLineWidth: 1,
          zeroLineBorderDash: [3, 3],
        },
      },
      {
        id: 'percentage',
        type: 'linear',
        display: 'auto',
        position: 'left',
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [3, 3],
          zeroLineColor: '#e5e9f2',
          zeroLineWidth: 1,
          zeroLineBorderDash: [3, 3],
        },
        ticks: {
          callback: (v) => v + '%',
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          display: true,
          zeroLineWidth: 2,
          zeroLineColor: '#fff',
          color: 'transparent',
          z: 1,
        },
        ticks: {
          beginAtZero: true,
          fontSize: 13,
          fontColor: '#182b49',
          stepSize: 3,
          autoSkip: true,
          maxTicksLimit: 10,
          maxRotation: 0,
        },
      },
    ],
  },
});

export const multiChartsOptions = {
  maintainAspectRatio: false,
  scaleShowVerticalLines: false,
  responsive: true,
  hover: {
    mode: 'nearest',
    intersect: false,
  },
  layout: {
    padding: {
      left: 5,
      right: 0,
      top: 10,
      bottom: 0,
    },
  },
  legend: {
    display: false,
    labels: {
      display: false,
    },
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
