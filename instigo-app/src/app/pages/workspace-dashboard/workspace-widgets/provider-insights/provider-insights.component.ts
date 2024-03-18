import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { SubSink } from 'subsink';
import { filter, map, skip } from 'rxjs/operators';
import { ObservableType } from '@instigo-app/data-transfer-object';
import { flatten } from 'lodash-es';
import { providerMetricsTypes, WorkspaceProviderMetric } from '../../workspace-dashboard-utils';
import { WorkspaceDashboardService } from '../../workspace-dashboard.service';
import { format, parseJSON } from 'date-fns';
import { versusMath } from '@app/global/utils';
import { providerColors, providerSquareIcons } from '@app/global/constants';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';

@Component({
  selector: 'ingo-workspace-widget-provider-insights',
  templateUrl: './provider-insights.component.html',
  styleUrls: ['./provider-insights.component.scss'],
})
export class ProviderInsightsComponent implements OnInit, OnDestroy {
  @Input()
  workspaceInsights$: BehaviorSubject<any> = new BehaviorSubject(null);

  @Select(WorkspaceState.defaultCurrency)
  public defaultCurrency$: Observable<string>;

  public inactiveMetrics: Set<number> = new Set();
  public allMetrics$: BehaviorSubject<WorkspaceProviderMetric[]> = new BehaviorSubject(null);
  public activeMetrics: any[];
  public metricTypes = providerMetricsTypes;
  public providerIcons = providerSquareIcons;
  public providerColors = providerColors;
  public activeRange$: BehaviorSubject<{ label: string; start: string; end: string }> = new BehaviorSubject(null);

  private subSink = new SubSink();

  constructor(private service: WorkspaceDashboardService, private analytics: AnalyticsService) {}

  ngOnInit() {
    this.subSink.sink = this.workspaceInsights$
      .pipe(
        skip(1),
        filter((data) => data.type === ObservableType.FINISH),
        map((result) => result),
        map((result) => {
          if (result.value) {
            return this.prepCardsData(result.value.byProvider);
          }
        }),
      )
      .subscribe((metricsData) => {
        this.activeMetrics = [];
        for (let i = 0; i < 6; i++) {
          this.activeMetrics.push({ ...metricsData[i], active: true });
        }
        metricsData.filter((item) => !item.active).forEach((v) => this.inactiveMetrics.add(v.id));
        this.allMetrics$.next(metricsData);
      });

    this.subSink.sink = this.service.currentDatePreset$.subscribe((currentDate) => {
      this.activeRange$.next({
        label: currentDate.label,
        start: format(parseJSON(currentDate.range.start), 'dd/MM/yyyy'),
        end: format(parseJSON(currentDate.range.end), 'dd/MM/yyyy'),
      });
    });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public toggleMetric(insertPosition, metricToActivate, metricToDeactivate): void {
    this.inactiveMetrics.add(metricToDeactivate);
    this.inactiveMetrics.delete(metricToActivate);
    const metricToBeActivated = this.allMetrics$.value.find((v) => v.id === metricToActivate);
    const metricToBeDeactivated = this.allMetrics$.value.find((v) => v.id === metricToDeactivate);
    metricToBeActivated.active = true;
    this.activeMetrics[insertPosition] = metricToBeActivated;
    this.analytics.sendEvent({
      event: 'Chart',
      action: 'toggle_metric',
      data: {
        event: 'Chart',
        chart: 'Provider Insights',
        chartLocation: 'Workspace Dashboard',
        metricToAdd: `${metricToBeActivated.provider}-${metricToBeActivated.metric}`,
        metricToRemove: `${metricToBeDeactivated.provider}-${metricToBeDeactivated.metric}`,
      },
    });
  }

  private prepCardsData(providerData): any {
    const cardsData = flatten(
      Object.entries(providerData.summary).map(([provider, total]) =>
        Object.entries(providerData.summary[provider]).map(([metric, summary]) => {
          const versus = providerData.versus[provider][metric];
          const change = versusMath(summary, versus);
          return { provider, metric, summary, versus, change };
        }),
      ),
    ).map((i, c) => {
      const hidden = i.provider === 'linkedin' && i.metric === 'uniqueClicks';
      return { ...i, id: c + 1, active: c < 6 && !hidden, hidden: hidden };
    });
    return cardsData;
  }
}
