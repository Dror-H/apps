import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ObservableLoadingInterface } from '@instigo-app/data-transfer-object';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { customTooltips } from '@app/widgets/shared/custom-tooltips';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'ingo-workspace-widget-provider-breakdown',
  templateUrl: './provider-breakdown.component.html',
  styleUrls: ['./provider-breakdown.component.scss'],
})
export class ProviderBreakdownComponent implements OnInit {
  @Input()
  workspaceStats$: Observable<ObservableLoadingInterface<any[]>>;

  public pieChartOptions: ChartOptions = {
    cutoutPercentage: 70,
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      display: false,
      position: 'bottom',
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    tooltips: {
      mode: 'label',
      intersect: false,
      position: 'average',
      enabled: false,
      custom: customTooltips,
    },
  };
  public pieChartLabels: Label[] = ['Linkedin', 'Facebook'];
  public pieChartColors = [
    {
      backgroundColor: ['#0E76A8', '#3B5998'],
    },
  ];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieLegendData$: Observable<any>;
  public providerColors = {
    facebook: '#3b5998',
    linkedin: '#0e76a8',
    twitter: '#00acee',
    instagram: '#8a3ab9',
    google: '#4285F4',
    tiktok: '#69C9D0',
  };

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.pieLegendData$ = this.workspaceStats$.pipe(
      filter((data) => data.type === 'finish'),
      map((data) => {
        const values = data.value['adAccountsProviderBreakdown'];
        return Object.entries(values).map(([label, value]) => ({
          label,
          value,
          color: this.providerColors[label],
        }));
      }),
    );
  }
}
