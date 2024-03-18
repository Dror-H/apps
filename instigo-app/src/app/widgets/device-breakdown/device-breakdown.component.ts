import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { legendOptions, pieChartOptions } from './device-breakdown.data';

@Component({
  selector: 'ingo-widget-device-breakdown',
  templateUrl: './device-breakdown.component.html',
  styleUrls: ['./device-breakdown.component.scss'],
})
export class DeviceBreakdownComponent implements OnInit, OnDestroy {
  @Input()
  public pieChartSubject$: Subject<{ value: { [key: string]: number }; metric: string; type: string }>;

  public pieChartOptions: ChartOptions = pieChartOptions;
  public pieChartLabels: Label[] = ['Desktop', 'Mobile', 'Tablet'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public legendData = [];
  public total = 0;
  private legendOptions = legendOptions;
  private subSink = new SubSink();
  private backgroundColor = ['#20C997', '#5F63F2', '#FA8B0C'];

  public pieChartColors = [
    {
      backgroundColor: this.backgroundColor,
    },
  ];

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.subSink.sink = this.pieChartSubject$.pipe(filter((data) => data.type === 'finish')).subscribe((data) => {
      this.pieChartLabels = [];
      this.pieChartData = [];
      this.legendData = [];
      this.pieChartColors = [
        {
          backgroundColor: [],
        },
      ];
      this.total = 0;
      this.legendData = [...Object.entries(data.value)]
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([key, value]) => ({
          ...this.legendOptions[key],
          value,
        }));

      Object.entries(data.value).forEach(([key, value]) => {
        this.pieChartLabels.push(key);
        this.pieChartData.push(value);
        this.pieChartColors[0].backgroundColor.push(this.legendOptions[key]?.colour);
        this.total += value;
      });

      if (this.pieChartColors[0].backgroundColor.length === 0) {
        this.pieChartColors[0].backgroundColor = this.backgroundColor;
      }
    });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
