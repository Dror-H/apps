import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { ConversionTypes } from '@app/global/constants';
import { getOneCampaignQuery } from '@app/global/get-one-campaign-query';
import { getTimeQueryParams } from '@app/global/get-time-query-params';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import {
  breakdownOptions,
  BreakdownsDetailsConfigInterface,
  breakdownsTableConfig,
  conversionOptions,
} from './breakdowns-details.config';
import countryByCode from './country-by-code';

@Component({
  selector: 'app-breakdown-details-table',
  templateUrl: './breakdown-details-table.component.html',
  styleUrls: ['./breakdown-details-table.component.scss'],
})
export class BreakdownDetailsTableComponent implements OnInit {
  @Input()
  campaignQueryForm = new FormGroup({});

  public tableMaxHeight = '560px';
  public tableData: Array<any> = [];
  public accountCurrency: string;
  public breakdownFormGroup: FormGroup;
  public breakdownsTableConfig: BreakdownsDetailsConfigInterface[] = breakdownsTableConfig;
  public breakdownOptions = breakdownOptions;
  public conversionOptions = conversionOptions;
  public isLoading$ = new BehaviorSubject<boolean>(false);

  private subscriptions = new SubSink();

  constructor(private readonly formBuilder: FormBuilder, private campaignApiService: CampaignApiService) {}

  ngOnInit(): void {
    this.breakdownFormGroup = this.formBuilder.group({
      breakdown: [],
      action: [],
    });
    this.subscriptions.sink = combineLatest([this.campaignQueryForm.valueChanges, this.breakdownFormGroup.valueChanges])
      .pipe(
        tap(() => this.isLoading$.next(true)),
        switchMap(([campaignForm, breakdownForm]) =>
          this.campaignApiService
            .insights({
              query: this.getQuery(campaignForm, breakdownForm),
            })
            .pipe(
              catchError((e) => {
                this.isLoading$.next(false);
                return of({ data: [] });
              }),
            ),
        ),
        map((response) => response?.data[0]),
      )
      .subscribe((campaign) => {
        this.isLoading$.next(false);
        this.accountCurrency = campaign.adAccount.currency;
        this.tableData = campaign?.insights?.data?.map((insights) => {
          const breakdown = this.getBreakdownColumnValue(insights);
          const prefix = insights.country ? countryByCode[insights.country]?.emoji : null;
          const conversions =
            insights.actions?.find((action) => action.actionType === this.breakdownFormGroup.value.action)?.value ||
            '-';
          const cpa =
            Number(
              insights.costPerActionType?.find((action) => action.actionType === this.breakdownFormGroup.value.action)
                ?.value,
            ) || '-';
          return { ...insights, conversions, cpa, breakdown };
        });
        this.tableMaxHeight = (this.tableData.length > 10 ? 560 : this.tableData.length * 56) + 'px';
      });
    this.breakdownFormGroup.patchValue({
      breakdown: this.breakdownOptions.country.value,
      action: ConversionTypes.link_click,
    });
  }

  private getBreakdownColumnValue(insights): { prefix: string; value: string } {
    let breakdown = '';
    let prefix = '';
    if (insights.country) {
      const country: { name: string; code: string; emoji: string } = countryByCode[insights.country];
      breakdown = `${breakdown} ${country?.name}`;
      prefix = country?.emoji;
      if (insights.region) {
        breakdown += ` / ${insights.region}`;
      }
    } else if (insights.region) {
      breakdown = insights.region;
    } else if (insights.age) {
      breakdown = insights.age;
      if (insights.gender) {
        breakdown += ` / ${insights.gender}`;
      }
    } else if (insights.devicePlatform) {
      breakdown = insights.devicePlatform.replace('_', ' ');
      if (insights.publisherPlatform) {
        breakdown = `${insights.publisherPlatform} / ${breakdown}`;
      }
    }
    breakdown = `${breakdown}
    ${insights?.hourlyRange || ''}`;

    return { prefix: prefix, value: breakdown.replace('undefined', 'Unknown') };
  }

  private getQuery(campaignForm: any, breakdownForm: any): string {
    return `${getOneCampaignQuery(campaignForm.campaign.id)}&${getTimeQueryParams({
      dateRange: campaignForm.dateRange.dateRange,
    })}&provider_parameters={"fields": ["actions", "cost_per_action_type"], "breakdowns":${JSON.stringify(
      this.breakdownOptions[breakdownForm.breakdown]?.param,
    )}}`;
  }
}
