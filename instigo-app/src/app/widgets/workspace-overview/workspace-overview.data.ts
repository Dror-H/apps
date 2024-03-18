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
const mainChartDataset = [
  {
    data: [20, 60, 50, 45, 50, 60, 70],
    backgroundColor: '#7854f766',
    hoverBackgroundColor: '#7854f7',
    label: 'Spend',
    barPercentage: 0.75,
    prefix: '€',
    suffix: '',
    change: '651.18',
    total: '2605.64',
    hidden: false,
  },
  {
    data: [10, 20, 30, 40, 30, 20, 45],
    backgroundColor: '#ffca0066',
    hoverBackgroundColor: '#ffca00',
    label: 'Clicks',
    barPercentage: 0.75,
    prefix: '',
    suffix: '',
    change: '1992',
    total: '14,592',
    hidden: false,
  },
  {
    data: [5, 10, 7, 15, 25, 30, 20],
    backgroundColor: '#12a5ed66',
    hoverBackgroundColor: '#12a5ed',
    label: 'CPC',
    barPercentage: 0.75,
    prefix: '€',
    suffix: '',
    change: '-0.119',
    total: '0.256',
    hidden: false,
  },
  {
    data: [10, 40, 30, 40, 60, 55, 45],
    backgroundColor: '#7ed32166',
    hoverBackgroundColor: '#7ed321',
    label: 'Conversions',
    barPercentage: 0.75,
    prefix: '',
    suffix: '',
    change: '147',
    total: '729',
    hidden: false,
  },
  // {
  //   data: [14, 34, 32, 50, 62, 25, 35],
  //   backgroundColor: '#d5d75040',
  //   hoverBackgroundColor: '#d5d851',
  //   label: 'Cost Per Click',
  //   barPercentage: 0.75,
  //   prefix: '€',
  //   suffix: '',
  //   change: '0.142',
  //   total: '0.325',
  //   hidden: false,
  // },
  {
    data: [14, 34, 32, 50, 62, 25, 35],
    backgroundColor: '#ff840066',
    hoverBackgroundColor: '#ff8400',
    label: 'Cost Per Conversion',
    barPercentage: 0.75,
    prefix: '€',
    suffix: '',
    change: '0.48',
    total: '5.71',
    hidden: false,
  },
];
export const mainChart: any = {
  height: 90,
  labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [...mainChartDataset],
  options: {
    tooltips: {
      mode: 'label',
      intersect: false,
      position: 'average',
      enabled: false,
      custom: customTooltips,
      callbacks: {
        label(t, d) {
          const dstLabel = d.datasets[t.datasetIndex].label;
          const { yLabel } = t;
          return `<span class="chart-data">${yLabel}</span> <span class="data-label">${dstLabel}</span>`;
        },
        labelColor(tooltipItem, chart) {
          const dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
          return {
            backgroundColor: dataset.hoverBackgroundColor,
            borderColor: 'transparent',
            usePointStyle: true,
          };
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        boxWidth: 6,
        display: true,
        usePointStyle: true,
      },
      align: 'start',
    },
    layout: {
      padding: {
        left: '0',
        right: 0,
        top: 0,
        bottom: '0',
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            color: '#e5e9f2',
            borderDash: [3, 3],
            zeroLineColor: '#e5e9f2',
            zeroLineWidth: 1,
            zeroLineBorderDash: [3, 3],
          },
          ticks: {
            beginAtZero: true,
            fontSize: 13,
            fontColor: '#182b49',
            max: Math.max(...mainChartDataset[0].data),
            stepSize: Math.max(...mainChartDataset[0].data) / 5,
            callback(label) {
              return `${label}k`;
            },
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
          //barPercentage: 0.75,
          ticks: {
            beginAtZero: true,
            fontSize: 13,
            fontColor: '#182b49',
          },
        },
      ],
    },
  },
};
export const randomizeData = () => {
  let arr = [];
  while (arr.length < 8) {
    let r = Math.floor(Math.random() * 100) + 1;
    if (arr.indexOf(r) === -1 && r > 5 && r < 75) arr.push(r);
  }
  return arr;
};
