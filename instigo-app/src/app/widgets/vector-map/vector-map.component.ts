import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import countryByCode from '@app/pages/campaign-details/components/breakdown-details-table/country-by-code';
import { ChartReadyEvent, ChartSelectionChangedEvent, ChartType, GoogleChartComponent } from 'angular-google-charts';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ingo-widget-vector-map',
  templateUrl: './vector-map.component.html',
  styleUrls: ['./vector-map.component.scss'],
})
export class VectorMapComponent implements OnInit {
  @Input()
  public mapData$: BehaviorSubject<{ value: { [key: string]: number }; type: string }>;

  @Input()
  public chartType: ChartType = ChartType.GeoChart;

  @Input()
  public chartOptions = {
    colorAxis: {
      colors: ['#dbe1e8', '#d1d7de', '#c4cad2', '#b2b8bf'],
    },
    backgroundColor: {
      fill: '#fff',
      stroke: '#fff',
    },
    datalessRegionColor: '#DBE1E8',
    legend: 'none',
  };

  @ViewChild('gChart', { static: false })
  public gChart: GoogleChartComponent;

  @Output()
  public chartReady: EventEmitter<ChartReadyEvent<google.visualization.ChartBase>> = new EventEmitter<
    ChartReadyEvent<google.visualization.ChartBase>
  >();

  @Output()
  public chartSelect: EventEmitter<ChartSelectionChangedEvent> = new EventEmitter<ChartSelectionChangedEvent>();
  public chartData: any[] = [];

  ngOnInit() {
    this.mapData$.pipe(filter((data) => data.type === 'finish')).subscribe((data) => {
      this.chartData = [];
      Object.keys(countryByCode).map((key, value) => {
        this.chartData.push([countryByCode[key].name, data.value[key] || 0]);
      });
    });
  }

  public onReady($event: ChartReadyEvent<google.visualization.ChartBase>): void {
    this.chartReady.emit($event);
  }

  public onSelect($event: ChartSelectionChangedEvent): void {
    this.chartSelect.emit($event);
  }
}
