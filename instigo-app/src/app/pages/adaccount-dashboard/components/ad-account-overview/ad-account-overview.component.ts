import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import countryByCode from '@app/pages/campaign-details/components/breakdown-details-table/country-by-code';
import { getTimeQueryParams } from '@app/global/get-time-query-params';
import { datePresets } from '@app/global/utils';
import { AnalyticsService } from '@app/shared/analytics/analytics.service';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { slideUp } from '@app/widgets/shared/animation';
import { AdAccountDTO, DateTimeInterval } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Select } from '@ngxs/store';
import { isEmpty } from 'lodash-es';
import { BehaviorSubject, combineLatest, concat, merge, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { SessionState } from '../../session-state.state';
import { AddAccountDropdownItems } from './add-account-dropdown-items';

@Component({
  selector: 'ingo-ad-account-overview',
  templateUrl: './ad-account-overview.component.html',
  styleUrls: ['./ad-account-overview.component.scss'],
  animations: [slideUp],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdAccountOverviewComponent),
      multi: true,
    },
  ],
})
export class AdAccountOverviewComponent
  extends ControlValueAccessorBaseHelper<DateTimeInterval>
  implements OnInit, OnDestroy
{
  @Select(SessionState.selectedTimeInterval)
  public selectedTimeInterval$: Observable<DateTimeInterval>;

  public value: DateTimeInterval = null;
  public valueSubject = new BehaviorSubject<DateTimeInterval>(null);
  public currentDate = new Date();

  public adAccountInsights$: Observable<any>;
  public chartType$: BehaviorSubject<string> = new BehaviorSubject('bar');
  public rangeText$: Observable<string>;
  public dropdownItems = [];
  public internalDatePresets = [
    datePresets(this.currentDate)[0],
    datePresets(this.currentDate)[1],
    datePresets(this.currentDate)[5],
  ];
  public mapData$: BehaviorSubject<{ value: { [key: string]: number }; type: string }> = new BehaviorSubject({
    value: null,
    type: null,
  });
  public tableData$: BehaviorSubject<{
    topRegions: { region: string; value: string }[];
    type: string;
  }> = new BehaviorSubject({ topRegions: [], type: null });

  public mapTitle = '';
  public pieChartSubject$: BehaviorSubject<{
    value: { [key: string]: number };
    metric: string;
    type: string;
  }> = new BehaviorSubject({
    value: null,
    type: null,
    metric: null,
  });
  public pieChartBreakdowns$: BehaviorSubject<{ breakdowns: string[] }> = new BehaviorSubject({
    breakdowns: ['age'],
  });
  breakdownField = {
    age: 'age',
    gender: 'gender',
    device_platform: 'devicePlatform',
  };
  private currentPieChartMetric = 'impressions';
  public pieChartOptions = [
    {
      label: 'Breakdowns',
      icon: 'fal fa-chart-line',
      show: true,
      submenu: [
        {
          label: 'Age',
          icon: 'fal fa-download',
          click: () => {
            this.sendAnalyticsEvent('age', 'Pie Chart', true);
            this.pieChartBreakdowns$.next({ breakdowns: ['age'] });
          },
          show: true,
        },
        {
          label: 'Gender',
          icon: 'fal fa-download',
          click: () => {
            this.sendAnalyticsEvent('gender', 'Pie Chart', true);
            this.pieChartBreakdowns$.next({ breakdowns: ['gender'] });
          },

          show: true,
        },
        {
          label: 'Device',
          icon: 'fal fa-download',
          click: () => {
            this.sendAnalyticsEvent('device_platform', 'Pie Chart', true);
            this.pieChartBreakdowns$.next({ breakdowns: ['device_platform'] });
          },
          show: true,
        },
      ],
    },
    {
      label: 'Metric',
      icon: 'fal fa-download',
      show: true,
      submenu: [
        {
          label: 'Impressions',
          icon: 'fal fa-download',
          click: () => {
            this.sendAnalyticsEvent('impressions', 'Pie Chart');
            this.currentPieChartMetric = 'impressions';
            this.pieChartSubject$.next({
              value: this.mapMetricByBreakdown(),
              metric: this.currentPieChartMetric,
              type: 'finish',
            });
          },
          show: true,
        },
        {
          label: 'Reach',
          icon: 'fal fa-download',
          click: () => {
            this.sendAnalyticsEvent('reach', 'Pie Chart');
            this.currentPieChartMetric = 'reach';
            this.pieChartSubject$.next({
              value: this.mapMetricByBreakdown(),
              metric: this.currentPieChartMetric,
              type: 'finish',
            });
          },
          show: true,
        },
      ],
    },
  ];
  private currentPieChartBreakdown = 'age';
  private pieChartBreakdowns: any;

  private countryBreakdowns: any;
  public metricOptions = [
    {
      label: 'Impressions',
      value: 'impressions',
      action: (isInitialized = true) => {
        if (isInitialized) {
          this.sendAnalyticsEvent('impressions', 'GeoMap');
        }
        const metricByCountry = this.mapMetricByCountry(this.countryBreakdowns, 'impressions');
        this.mapData$.next({
          value: metricByCountry,
          type: isEmpty(metricByCountry) ? 'empty' : 'finish',
        });
        this.mapTitle = 'Impressions';
        const topMetricValuesByCountry = this.selectTopMetricValuesByCountry(this.countryBreakdowns, 'impressions');
        this.tableData$.next({
          topRegions: topMetricValuesByCountry,
          type: isEmpty(topMetricValuesByCountry) ? 'empty' : 'finish',
        });
      },
    },
    {
      label: 'Clicks',
      value: 'clicks',
      action: () => {
        this.sendAnalyticsEvent('clicks', 'GeoMap');
        const metricByCountry = this.mapMetricByCountry(this.countryBreakdowns, 'clicks');
        this.mapData$.next({
          value: metricByCountry,
          type: isEmpty(metricByCountry) ? 'empty' : 'finish',
        });
        this.mapTitle = 'Clicks';
        const topMetricValuesByCountry = this.selectTopMetricValuesByCountry(this.countryBreakdowns, 'clicks');
        this.tableData$.next({
          topRegions: topMetricValuesByCountry,
          type: isEmpty(topMetricValuesByCountry) ? 'empty' : 'finish',
        });
      },
    },
  ];
  @Select(SessionState.selectedAdAccount)
  private selectedAdAccount$: Observable<AdAccountDTO>;

  private subSink = new SubSink();

  constructor(private adAccountApiService: AdAccountApiService, private analytics: AnalyticsService) {
    super();
    this.dropdownItems = new AddAccountDropdownItems(this.chartType$).dropdownItems;
    this.dropdownItems[0].click;
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  ngOnInit(): void {
    this.adAccountInsights$ = this.selectedAdAccount$.pipe(
      switchMap((selectedAccount) =>
        merge(
          of({ type: 'start' }),
          this.valueSubject.pipe(
            switchMap((value) => {
              const qb = RequestQueryBuilder.create();
              const query = qb.setLimit(1).setPage(1);
              query.setFilter({
                field: 'id',
                operator: CondOperator.EQUALS,
                value: selectedAccount?.id,
              });
              return this.adAccountApiService
                .insights({
                  query: `${query.query()}&time_increment=daily&${getTimeQueryParams({
                    dateRange: value?.dateRange,
                  })}&provider_parameters={"versus":true}`,
                })
                .pipe(map((value) => ({ type: 'finish', value: value.data[0] })));
            }),
          ),
        ),
      ),
    );

    this.setDataMapWidget();
    this.setPieChartData();
  }

  writeValue(obj: DateTimeInterval): void {
    this.value = obj;
    this.valueSubject.next(this.value);
  }

  public changeRange(timeframe: any) {
    this.value = {
      datePreset: timeframe.value,
      dateRange: { start: timeframe.range.start, end: timeframe.range.end },
    } as DateTimeInterval;
    this.onChanged(this.value);
    this.valueSubject.next(this.value);
  }

  public isActiveRange(label, internalizeInterval, selectedTimeInterval) {
    if (internalizeInterval !== 'empty' && label === internalizeInterval?.datePreset) {
      return true;
    }
    return internalizeInterval === 'empty' && label === selectedTimeInterval?.datePreset;
  }

  private mapMetricByCountry(breakdowns: any[], metricField: string): { [key: string]: number } {
    const mapData = {};
    breakdowns.forEach((breakdown: any) => {
      mapData[breakdown.country] = breakdown[metricField];
    });
    return mapData as { [key: string]: number };
  }

  private selectTopMetricValuesByCountry(
    breakdowns: any[],
    metricField: string,
  ): { region: string; emoji: string; value: string }[] {
    const sortedBreakdowns = [...breakdowns];
    sortedBreakdowns.sort((a, b) => b[metricField] - a[metricField]);
    const topTotal = 7;
    return sortedBreakdowns.slice(0, topTotal).map((breakdown) => {
      const country: { name: string; code: string; emoji: string } = countryByCode[breakdown.country];
      return { region: country?.name || 'Unknown', emoji: country?.emoji || '', value: breakdown[metricField] };
    });
  }

  private setDataMapWidget() {
    this.subSink.sink = this.selectedAdAccount$
      .pipe(
        switchMap((selectedAccount) =>
          this.selectedTimeInterval$.pipe(
            switchMap((value) => {
              const qb = RequestQueryBuilder.create();
              const query = qb.setLimit(1).setPage(1);
              query.setFilter({
                field: 'id',
                operator: CondOperator.EQUALS,
                value: selectedAccount?.id,
              });
              return concat(
                of({ type: 'start' }),
                this.adAccountApiService
                  .insights({
                    query: `${query.query()}&provider_parameters={"fields": ["actions"],"breakdowns":["country"]}&${getTimeQueryParams(
                      {
                        dateRange: value?.dateRange,
                      },
                    )}`,
                  })
                  .pipe(map((value) => value.data[0].insights.data)),
              );
            }),
          ),
        ),
        filter((data) => data?.type !== 'start'),
        tap((data) => {
          this.countryBreakdowns = data;
          this.metricOptions[0].action(false);
        }),
      )
      .subscribe();
  }

  private setPieChartData() {
    this.subSink.sink = combineLatest([this.selectedAdAccount$, this.pieChartBreakdowns$])
      .pipe(
        switchMap(([selectedAccount, breakdowns]) =>
          this.selectedTimeInterval$.pipe(
            switchMap((value) => {
              this.currentPieChartBreakdown = breakdowns.breakdowns[0];
              const qb = RequestQueryBuilder.create();
              const query = qb.setLimit(1).setPage(1);
              query.setFilter({
                field: 'id',
                operator: CondOperator.EQUALS,
                value: selectedAccount?.id,
              });
              return concat(
                of({ type: 'start' }),
                this.adAccountApiService
                  .insights({
                    query: `${query.query()}&provider_parameters=${JSON.stringify(breakdowns)}&${getTimeQueryParams({
                      dateRange: value?.dateRange,
                    })}`,
                  })
                  .pipe(map((value) => value.data[0].insights.data)),
              );
            }),
          ),
        ),
        filter((data) => data?.type !== 'start'),
        tap((data) => {
          this.pieChartBreakdowns = data;
          const metricByBreakdown = this.mapMetricByBreakdown();
          this.pieChartSubject$.next({
            value: metricByBreakdown,
            metric: this.currentPieChartMetric,
            type: isEmpty(metricByBreakdown) ? 'empty' : 'finish',
          });
        }),
      )
      .subscribe();
  }

  private mapMetricByBreakdown(): { [key: string]: number } {
    const pieChartData = {};
    this.pieChartBreakdowns.forEach((breakdown: any) => {
      pieChartData[breakdown[this.breakdownField[this.currentPieChartBreakdown]]] =
        breakdown[this.currentPieChartMetric];
    });
    return pieChartData as { [key: string]: number };
  }

  private sendAnalyticsEvent(metricToBeActivated: string, chart: string, isBreakdown?: boolean) {
    this.analytics.sendEvent({
      event: 'Chart',
      action: 'change_metric',
      data: {
        event: 'Chart',
        chartLocation: 'Ad Account Dashboard',
        chart: chart,
        metricToAdd: `${isBreakdown ? 'breakdown-' : ''}${metricToBeActivated}`,
      },
    });
  }
}
