import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { ChartType } from '../multi-charts.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'ingo-widget-multi-charts-chart',
  templateUrl: './multi-charts-chart.component.html',
})
export class MultiChartsChartComponent implements OnChanges {
  @ViewChild('dashboardCard') chart: BaseChartDirective;

  @Input() model: ChartType;

  @Input() chartId: string;

  @Input() compare: number;

  @Input() icon: string;

  @Input() metric: string;

  @Input() total: string;

  @Input() totalLast: string;

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: string = 'line';
  barChartLegend: boolean = true;
  barChartData: any[] = [];

  ngOnChanges() {
    this.changeModel();
  }
  private changeModel() {
    this.barChartData = this.model.datasets;
    this.barChartLabels = this.model.labels;
    this.barChartOptions = this.model.options;
    this.chartId;
  }
}
