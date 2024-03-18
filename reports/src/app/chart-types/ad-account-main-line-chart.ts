export const adAccountMainLineChart = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    width: 500,
    height: 350,
    devicePixelRatio: 2,
    responsive: false,
    animation: {
      duration: 0,
    },
    legend: {
      display: true,
    },
    scales: {
      xAxes: [
        {
          display: false,
          scaleLabel: {
            display: true,
            labelString: 'Timeline',
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 3,
          },
          id: 'y-axis-1',
          scaleLabel: {
            display: false,
            labelString: 'Value',
          },
          gridLines: {
            display: false,
          },
        },
        {
          display: false,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 3,
          },
          id: 'y-axis-2',
          scaleLabel: {
            display: false,
            labelString: 'Value',
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
  },
};

export const simpleLineChart = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    width: 500,
    height: 350,
    devicePixelRatio: 2,
    responsive: false,
    animation: {
      duration: 0,
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: false,
          scaleLabel: {
            display: true,
            labelString: 'Timeline',
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          display: false,
          id: 'y-axis-1',
          scaleLabel: {
            display: false,
            labelString: 'Value',
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
  },
};
