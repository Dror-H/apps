import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { slideUp } from '../shared/animation';
import { mainChart, randomizeData } from './workspace-overview.data';
import { ChartType } from './workspace-overview.model';
import html2canvas from 'html2canvas';

@Component({
  selector: 'ingo-widget-workspace-overview',
  templateUrl: './workspace-overview.component.html',
  styleUrls: ['./workspace-overview.component.scss'],
  animations: [slideUp],
})
export class WorkspaceOverviewComponent implements OnInit {
  // Export chart spinner
  isExporting = false;

  // Chart ranges
  rangeText: string;
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

  // Card dropdown items
  dropdownItems: any[];

  // Checks if bar or line
  selectedChartType: string = 'bar';

  // Custom legend
  chartMetrics: Array<any> = [];

  // Bar chart (ng2-charts)
  mainChart: ChartType;
  public barChart = mainChart;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.rangeText = 'Oct 14, 2020 - Oct 21, 2020';
    this.activeRange = 'week';
    this.dropdownItems = [
      {
        label: 'Switch to Line',
        icon: 'fal fa-chart-line',
        click: () => this.toggleChart(),
        show: true,
        submenu: [],
      },
      {
        label: 'Switch to Bar',
        icon: 'fal fa-chart-bar',
        click: () => this.toggleChart(),
        show: false,
        submenu: [],
      },
      {
        label: 'Export',
        icon: 'fal fa-download',
        click: () => this.downloadChart('#main-chart-content'),
        show: true,
        submenu: [
          {
            label: 'Export Chart',
            icon: 'fal fa-download',
            click: () => this.downloadChart('#main-chart-content'),
            show: true,
          },
          {
            label: 'Export Legend',
            icon: 'fal fa-download',
            click: () => this.downloadChart('#main-chart-legend'),
            show: true,
          },
          {
            label: 'Export All',
            icon: 'fal fa-download',
            click: () => this.downloadChart('#main-chart-card'),
            show: true,
          },
        ],
      },
    ];

    this.barChart.datasets.forEach((item, index) => {
      this.chartMetrics.push({
        id: index + 1,
        title: item.label,
        prefix: item.prefix,
        suffix: item.suffix,
        total: item.total,
        change: Math.abs(item.change),
        icon: Math.sign(item.change) == -1 ? 'down' : 'up',
      });
    });
  }

  toggleRange(timeframe: string) {
    this.rangeText =
      timeframe === 'week'
        ? 'Oct 14, 2020 - Oct 21, 2020'
        : timeframe === 'month'
        ? 'Sep 21, 2020 - Oct 21, 2020'
        : 'Oct 21, 2019 - Oct 21, 2020';
    this.activeRange = timeframe;
    for (let i = 0; i < this.barChart.datasets.length; i++) {
      this.barChart.datasets[i].data = randomizeData();
    }
  }
  toggleChart(): void {
    this.selectedChartType = this.selectedChartType === 'bar' ? 'line' : 'bar';
    this.dropdownItems[0].show = !this.dropdownItems[0].show;
    this.dropdownItems[1].show = !this.dropdownItems[1].show;
  }
  toggleSeries(item) {
    this.barChart.datasets[item].hidden = !this.barChart.datasets[item].hidden;
    document.getElementById('main-bar-chart').click();
    document.querySelectorAll('.ingo-card-chart-tooltip').forEach((e) => e.parentNode.removeChild(e));
  }

  downloadChart(element) {
    this.isExporting = true;
    html2canvas(document.querySelector(element)).then((canvas) => {
      this.isExporting = false;
      canvas.toBlob((blob) => {
        let downloadURL = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'workspace-name-date.png';
        link.click();
      });
    });
  }
}
