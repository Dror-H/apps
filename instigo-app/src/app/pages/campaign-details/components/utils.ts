export function customTooltip(tooltip) {
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
    return bodyItem.before + bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(getBody);

    let innerHtml = '<thead>';

    titleLines.forEach(function (title) {
      innerHtml += `<div class="tooltip-title"><b>${title}</b></div>`;
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
}

export const chartLinearGradient = (canvas, height, color) => {
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `${color.start}`);
  gradient.addColorStop(1, `${color.end}`);
  return gradient;
};
