import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import { ChartType } from '../workspace-overview.model';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'ingo-widget-workspace-overview-chart',
  templateUrl: './workspace-overview-chart.component.html',
})
export class WorkspaceOverviewChartComponent implements OnChanges {
  @ViewChild('dashboardCard') chart: BaseChartDirective;

  @Input() model: ChartType;

  @Input() chartId: string;

  @Input() chartType: string;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [];

  ngOnChanges() {
    this.changeModel();
    this.barChartType = this.chartType === '' ? this.barChartType : this.chartType;
  }
  private changeModel() {
    this.barChartData = this.model.datasets;
    this.barChartLabels = this.model.labels;
    this.barChartOptions = this.model.options;
    this.chartId = this.chartId;
  }
}
