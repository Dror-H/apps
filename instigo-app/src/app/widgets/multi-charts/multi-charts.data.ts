export const chartLinearGradient = (canvas, height, color) => {
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `${color.start}`);
  gradient.addColorStop(1, `${color.end}`);
  return gradient;
};

export const customTooltips = function (tooltip) {
  // Tooltip Element
  let tooltipEl = document.querySelector('.ingo-card-chart-tooltip') as HTMLElement;

  if (!this._chart.canvas.closest('.parentContainer').contains(tooltipEl)) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'ingo-card-chart-tooltip';
    tooltipEl.innerHTML = '<table></table>';

    document.querySelectorAll('.parentContainer').forEach((el) => {
      if (el.contains(document.querySelector('.ingo-card-chart-tooltip'))) {
        document.querySelector('.ingo-card-chart-tooltip').remove();
      }
    });

    this._chart.canvas.closest('.parentContainer').appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(getBody);

    let innerHtml = '<thead>';

    titleLines.forEach(function (title) {
      innerHtml += `<div class='tooltip-title'>${title}</div>`;
    });
    innerHtml += '</thead><tbody>';

    bodyLines.forEach(function (body, i) {
      const colors = tooltip.labelColors[i];
      let style = `background:${colors.backgroundColor}`;
      style += `; border-color:${colors.borderColor}`;
      style += '; border-width: 2px';
      style += '; border-radius: 30px';
      const span = `<span class="tooltip-key" style="${style}"></span>`;
      innerHtml += `<tr><td>${span}${body}</td></tr>`;
    });

    innerHtml += '</tbody>';

    const tableRoot = tooltipEl.querySelector('table');
    tableRoot.innerHTML = innerHtml;
  }

  const positionY = this._chart.canvas.offsetTop;
  const positionX = this._chart.canvas.offsetLeft;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
  tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
  tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
  tooltipEl.style.fontSize = `${tooltip.bodyFontSize}px`;
  tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
  tooltipEl.style.padding = `${tooltip.yPadding}px ${tooltip.xPadding}px`;
};
export const randomizeCards = () => {
  let arr = [];
  while (arr.length < 8) {
    let r = Math.floor(Math.random() * 100) + 1;
    if (arr.indexOf(r) === -1 && r > 20) arr.push(r);
  }
  return arr;
};
function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}
export const randomizeChart = (itemsToCreate) => {
  let arr = [];
  while (arr.length < itemsToCreate) {
    let r = Math.floor(Math.random() * 100) + 1;
    if (arr.indexOf(r) === -1 && r > 20) arr.push(r);
  }
  return arr;
};
export const getCategoriesArray = (date1, date2) => {
  let range = [];
  let mil = 86400000; //24h
  for (let i = date1.getTime(); i < date2.getTime(); i = i + mil) {
    let date = new Date(i);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    range.push(day + '/' + month);
  }
  return range;
};
export const generateMainChartData = (dateRange) => {
  const date1 = new Date(dateRange.start.month + '/' + dateRange.start.day + '/' + dateRange.start.year);
  const date2 = new Date(dateRange.end.month + '/' + dateRange.end.day + '/' + dateRange.end.year);
  const categories = getCategoriesArray(date1, date2);
  const itemsToCreate = getDifferenceInDays(date1, date2);
  let fakeData = {
    categories: getCategoriesArray(date1, date2),
    series: [
      {
        name: 'Impressions',
        data: randomizeChart(itemsToCreate),
      },
      // {
      //   name: "Clicks",
      //   data: randomizeChart(itemsToCreate)
      // },
      // {
      //   name: "Click Through",
      //   data: randomizeChart(itemsToCreate)
      // },
      // {
      //   name: "Conversions",
      //   data: randomizeChart(itemsToCreate)
      // },
      // {
      //   name: "Cost Per Click",
      //   data: randomizeChart(itemsToCreate)
      // },
      // {
      //   name: "Cost Per Conversion",
      //   data: randomizeChart(itemsToCreate)
      // },
      // {
      //   name: "Spent",
      //   data: randomizeChart(itemsToCreate)
      // },
    ],
  };
  return fakeData;
};
export const defaultLabels = {
  labelsDay: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  labelsWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  labelsMonth: ['01-04', '05-09', '10-14', '15-19', '20-24', '25-28', '29-31'],
  labelsYear: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
};
export const defaultOptions: any = {
  maintainAspectRatio: true,
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
export const impressionsData: any = {
  labels: [...defaultLabels.labelsDay],
  datasets: [
    {
      data: randomizeCards(),
      borderColor: '#20C997',
      borderWidth: 3,
      fill: true,
      pointHoverRadius: 0,
      pointHoverBorderColor: 'transparent',
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('impression'), 165, {
          start: '#20C99710',
          end: '#20C99701',
        }),
    },
  ],
  options: {
    ...defaultOptions,
    tooltips: {
      mode: 'nearest',
      intersect: false,
      enabled: false,
      custom: customTooltips,
      callbacks: {
        labelColor(tooltipItem, chart) {
          return {
            backgroundColor: '#20C997',
            borderColor: 'transparent',
          };
        },
      },
    },
  },
};
export const pageLikesData: any = {
  labels: [...defaultLabels.labelsDay],
  datasets: [
    {
      data: randomizeCards(),
      borderColor: '#FF69A5',
      borderWidth: 3,
      fill: true,
      pointHoverRadius: 0,
      pointHoverBorderColor: 'transparent',
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('page-likes'), 165, {
          start: '#FF69A510',
          end: '#FF69A501',
        }),
    },
  ],
  options: {
    ...defaultOptions,
    tooltips: {
      mode: 'nearest',
      intersect: false,
      enabled: false,
      custom: customTooltips,
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
export const adClicksData: any = {
  labels: [...defaultLabels.labelsDay],
  datasets: [
    {
      data: randomizeCards(),
      borderColor: '#5F63F2',
      borderWidth: 3,
      fill: true,
      pointHoverRadius: 0,
      pointHoverBorderColor: 'transparent',
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('ad-clicks'), 165, {
          start: '#5F63F210',
          end: '#5F63F201',
        }),
    },
  ],
  options: {
    ...defaultOptions,
    tooltips: {
      mode: 'nearest',
      intersect: false,
      enabled: false,
      custom: customTooltips,
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
export const likesData: any = {
  labels: [...defaultLabels.labelsDay],
  datasets: [
    {
      data: randomizeCards(),
      borderColor: '#FA8B0C',
      borderWidth: 3,
      fill: true,
      pointHoverRadius: 0,
      pointHoverBorderColor: 'transparent',
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('likes'), 165, {
          start: '#FA8B0C10',
          end: '#FA8B0C01',
        }),
    },
  ],
  options: {
    ...defaultOptions,
    tooltips: {
      mode: 'nearest',
      intersect: false,
      enabled: false,
      custom: customTooltips,
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
export const loadNewData: any = (oldData, timeframe) => ({
  labels: defaultLabels[timeframe],
  datasets: oldData.datasets,
  options: oldData.options,
});
