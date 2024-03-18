import { Injectable } from '@angular/core';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class AddAccountDropdownItems {
  private toggleChart = (type) => {
    this.chartType$.next(type);
    this.dropdownItems[0].show = !this.dropdownItems[0].show;
    this.dropdownItems[1].show = !this.dropdownItems[1].show;
    this.sendAnalyticsEvent(type);
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public dropdownItems = [
    {
      label: 'Switch to Line',
      icon: 'fal fa-chart-line',
      click: () => this.toggleChart('line'),
      show: true,
      submenu: [],
    },
    {
      label: 'Switch to Bar',
      icon: 'fal fa-chart-bar',
      click: () => this.toggleChart('bar'),
      show: false,
      submenu: [],
    },
  ];
  constructor(private chartType$: BehaviorSubject<string>) {}

  private sendAnalyticsEvent(type) {
    AnalyticsService.instance.sendEvent({
      event: 'Chart',
      action: 'change_type',
      data: {
        event: 'Chart',
        chartLocation: 'Campaign Details',
        prevType: type !== 'line' ? 'line' : 'bar',
        newType: type,
      },
    });
  }
}
