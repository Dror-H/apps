import { Component, OnInit } from '@angular/core';
import { ChartType } from './engagement-overview.model';
import { rowChartsData, rowChartsOptions, rowChartsStyle } from './engagement-overview.data';

@Component({
  selector: 'ingo-widget-engagement-overview',
  templateUrl: './engagement-overview.component.html',
  styleUrls: ['./engagement-overview.component.scss'],
})
export class EngagementOverviewComponent implements OnInit {
  rangeText: string;
  rowCharts: ChartType[] = [];
  activeRange: string;
  ranges = [
    {
      label: 'week',
      text: 'Week',
    },
    {
      label: 'month',
      text: 'Month',
    },
    {
      label: 'year',
      text: 'Year',
    },
  ];

  constructor() {}

  ngOnInit() {
    this.activeRange = 'week';
    Object.keys(rowChartsData[this.activeRange]).forEach((key) => {
      this.rowCharts.push({
        id: key,
        total: rowChartsData[this.activeRange][key].total,
        trend: rowChartsData[this.activeRange][key].trend,
        change: rowChartsData[this.activeRange][key].change,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: rowChartsData[this.activeRange][key].chartValue,
            ...rowChartsStyle,
          },
        ],
        options: {
          ...rowChartsOptions,
        },
      });
    });
  }
  toggleRange(timeframe: string) {
    this.activeRange = timeframe;
    for (let i = 0; i < this.rowCharts.length; i++) {
      this.rowCharts[i].datasets[0].data = rowChartsData[this.activeRange][this.rowCharts[i].id].chartValue;
      this.rowCharts[i].total = rowChartsData[this.activeRange][this.rowCharts[i].id].total;
      this.rowCharts[i].trend = rowChartsData[this.activeRange][this.rowCharts[i].id].trend;
      this.rowCharts[i].change = rowChartsData[this.activeRange][this.rowCharts[i].id].change;
    }
  }
}
