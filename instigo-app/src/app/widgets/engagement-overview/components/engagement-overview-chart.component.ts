import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { ChartType } from '../engagement-overview.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'ingo-widget-engagement-overview-chart',
  templateUrl: './engagement-overview-chart.component.html',
})
export class EngagementOverviewChartComponent implements OnChanges {
  @ViewChild('engagementRow') chart: BaseChartDirective;

  @Input() model: ChartType;

  @Input() chartId: string;

  chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  chartLabels: string[] = [];
  chartType: string = 'line';
  chartLegend: boolean = true;
  chartData: any[] = [];

  ngOnChanges() {
    this.changeModel();
  }
  private changeModel() {
    this.chartData = this.model.datasets;
    this.chartLabels = this.model.labels;
    this.chartOptions = this.model.options;
  }
}
