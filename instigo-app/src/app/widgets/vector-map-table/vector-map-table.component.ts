import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface TableEntry {
  region: string;
  metric: string;
}

@Component({
  selector: 'ingo-widget-vector-map-table',
  templateUrl: './vector-map-table.component.html',
  styleUrls: ['./vector-map-table.component.scss'],
})
export class VectorMapTableComponent {
  @Input()
  public tableData$: BehaviorSubject<{ topRegions: TableEntry[]; type: string }>;

  @Input()
  public metricType: string;
}
