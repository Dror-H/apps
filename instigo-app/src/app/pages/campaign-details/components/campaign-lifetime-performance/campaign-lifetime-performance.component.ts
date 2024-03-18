import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CampaignDTO } from '@instigo-app/data-transfer-object';
import { BehaviorSubject } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CampaignDetailsService } from '../../campaign-details.service';

@Component({
  selector: 'app-campaign-lifetime-performance',
  templateUrl: './campaign-lifetime-performance.component.html',
  styleUrls: ['./campaign-lifetime-performance.component.scss'],
})
export class CampaignLifetimePerformanceComponent implements OnInit, OnDestroy {
  @Input()
  selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }>;

  @Input()
  metricsType: string = 'lifetimePerformance';

  public multiCharts: { chartData; type; chartLabels };
  private subSink = new SubSink();

  constructor(public campaignDetailsService: CampaignDetailsService) {}

  ngOnInit() {
    this.subSink.sink = this.selectedCampaign$
      .pipe(
        skip(1),
        map((result) => this.campaignDetailsService.buildChart(result, 0, false, this.metricsType)),
      )
      .subscribe((result) => {
        this.multiCharts = result;
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
