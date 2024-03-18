import { customTooltips } from '../shared/custom-tooltips';

const randomizeChange = () => Math.floor(Math.random() * 100) + 1 + '%';

export const rowChartsData: any = {
  week: {
    post: {
      total: '472',
      chartValue: [10, 25, 28, 22, 15, 18, 22, 20, 15, 17, 25, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    like: {
      total: '2K',
      chartValue: [0, -10, 18, 5, 17, 0, 1, 2, 11, 30, 15, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    comments: {
      total: 78,
      chartValue: [5, 10, 8, 10, 7, 10, 15, 20, 12, 17, 15, 10],
      trend: 'down',
      change: randomizeChange(),
    },
    rate: {
      total: '4.8',
      chartValue: [0, 10, 0, 15, 0, 18, 0, 10, 12, 18, 25, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    followers: {
      total: 178,
      chartValue: [5, 10, 8, 10, 7, 10, 15, 20, 12, 17, 15, 10],
      trend: 'up',
      change: randomizeChange(),
    },
  },
  month: {
    post: {
      total: '2472',
      chartValue: [0, 10, 8, 15, 7, 10, 15, 20, 18, 35, 25, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    like: {
      total: '8K',
      chartValue: [0, -10, 18, 5, 17, 0, 1, 2, 11, 30, 15, 30],
      trend: 'down',
      change: randomizeChange(),
    },
    comments: {
      total: 278,
      chartValue: [0, 15, 10, 18, 20, 15, 10, 7, 15, 8, 10, 30],
      trend: 'down',
      change: randomizeChange(),
    },
    rate: {
      total: '3.8',
      chartValue: [0, 10, 0, 15, 0, 18, 0, 10, 12, 18, 25, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    followers: {
      total: 778,
      chartValue: [0, 10, 8, 15, 7, 10, 15, 20, 18, 35, 25, 30],
      trend: 'down',
      change: randomizeChange(),
    },
  },
  year: {
    post: {
      total: '5472',
      chartValue: [0, 250, 200, 220, 309, 301, 250, 180, 320, 270, 250, 300],
      trend: 'down',
      change: randomizeChange(),
    },
    like: {
      total: '78K',
      chartValue: [0, -10, 18, 5, 17, 0, 1, 2, 11, 30, 15, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    comments: {
      total: 2078,
      chartValue: [0, 250, 200, 220, 309, 301, 250, 180, 320, 270, 250, 300],
      trend: 'up',
      change: randomizeChange(),
    },
    rate: {
      total: '4.8',
      chartValue: [0, 10, 0, 15, 0, 18, 0, 10, 12, 18, 25, 30],
      trend: 'up',
      change: randomizeChange(),
    },
    followers: {
      total: 5778,
      chartValue: [0, 250, 200, 220, 309, 301, 250, 180, 320, 270, 250, 300],
      trend: 'up',
      change: randomizeChange(),
    },
  },
};

export const rowChartsOptions = {
  tooltips: {
    yAlign: 'bottom',
    xAlign: 'center',
    mode: 'nearest',
    position: 'nearest',
    intersect: false,
    enabled: false,
    custom: customTooltips,
    callbacks: {
      labelColor(tooltipItem, chart) {
        return {
          backgroundColor: '#20C997',
        };
      },
    },
  },
  hover: {
    mode: 'nearest',
    intersect: false,
  },
  layout: {
    padding: {
      left: '0',
      right: 8,
      top: 15,
      bottom: -10,
    },
  },
  maintainAspectRatio: true,
  responsive: true,
  legend: {
    display: false,
    labels: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0,
    },
  },
  scales: {
    yAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [8, 4],
          zeroLineColor: 'transparent',
          beginAtZero: true,
        },
        ticks: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
          color: '#e5e9f2',
          borderDash: [8, 4],
          zeroLineColor: 'transparent',
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
};

export const rowChartsStyle = {
  borderColor: '#C6D0DC',
  borderWidth: 2,
  fill: false,
  pointRadius: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
  pointBackgroundColor: [
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    'transparent',
    '#20C997',
  ],
  pointHoverBackgroundColor: '#20C997',
  pointHoverRadius: 6,
  pointBorderColor: 'transparent',
};
