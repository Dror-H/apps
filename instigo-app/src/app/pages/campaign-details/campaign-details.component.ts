import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdSetApiService } from '@app/api/services/ad-set.api.service';
import { AdApiService } from '@app/api/services/ad.api.service';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { SessionState } from '@app/pages/adaccount-dashboard/session-state.state';
import { AdDTO, AdSetDTO, CampaignDTO, DateTimeInterval } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BehaviorSubject, concat, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CampaignDetailsService } from './campaign-details.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  public selectedCampaign$: BehaviorSubject<{ value: CampaignDTO; type: string }> = new BehaviorSubject({
    value: null,
    type: null,
  });
  public campaignAdSets$: BehaviorSubject<Array<AdSetDTO>> = new BehaviorSubject([]);
  public campaignAds$: BehaviorSubject<Array<AdDTO>> = new BehaviorSubject([]);
  public campaignQueryForm: FormGroup;
  public linkedinSpendToday: number = null;
  public provider: string;
  public activeTab = 0;

  @Emitter(SessionState.setDateTimeInterval)
  private setSelectedTimeInterval: Emittable<DateTimeInterval>;

  @SelectSnapshot(SessionState.selectedTimeInterval)
  private selectedTimeInterval: DateTimeInterval;

  private subSink = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private campaignApiService: CampaignApiService,
    private adSetApiService: AdSetApiService,
    private adsApiService: AdApiService,
    private activeRoute: ActivatedRoute,
    private campaignDetailsService: CampaignDetailsService,
  ) {}

  ngOnInit(): void {
    this.campaignQueryForm = this.formBuilder.group({
      campaign: [null],
      dateRange: [
        {
          dateRange: {
            start: this.selectedTimeInterval?.dateRange?.start,
            end: this.selectedTimeInterval?.dateRange?.end,
          },
        },
      ],
    });

    this.getCampaign();
    this.getAdSets();
    this.emitDateRangeValueChanges();

    if (this.activeRoute.snapshot.params.id) {
      this.campaignQueryForm.patchValue({
        campaign: { id: this.activeRoute.snapshot.params.id },
      });
      this.provider = this.activeRoute.snapshot.queryParams.provider;
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private getCampaign(): void {
    this.subSink.sink = this.campaignQueryForm.valueChanges
      .pipe(
        switchMap((value) =>
          concat(
            of({ type: 'start' }),
            this.campaignApiService
              .insights({
                query: this.campaignDetailsService.getCampaignQuery(value),
              })
              .pipe(
                map((response) => response?.data[0]),
                map((value: CampaignDTO) => {
                  this.campaignDetailsService.campaignCurrency.next(value.adAccount.currency);
                  return { type: 'finish', value };
                }),
                catchError(() => of(null)),
              ),
          ),
        ),
        tap((campaign) => {
          if (campaign.value?.provider === 'linkedin' && campaign.type === 'finish') {
            this.getLinkedinBudgetRemaining(campaign.value?.id);
            this.getLinkedinAds(campaign.value?.id);
          }
          this.selectedCampaign$.next(campaign);
        }),
      )
      .subscribe();
  }

  private getAdSets(): void {
    this.subSink.add(
      this.selectedCampaign$.subscribe((data) => {
        if (data.type === 'finish') {
          const query = this.campaignDetailsService.getAdSetsAdsQuery(
            this.campaignQueryForm,
            this.selectedCampaign$.value?.value.id,
          );
          this.adSetApiService
            .insights({ query: query })
            .pipe(
              map((response) => response.data),
              map((adSets) => {
                if (adSets) {
                  return adSets.map((adSet) => ({
                    ...adSet,
                    ...adSet.insights?.summary,
                    currency: adSet.adAccount.currency,
                    budget: adSet.budget ? adSet.budget : 'CBO',
                  }));
                } else {
                  return [];
                }
              }),
              catchError(() => of(null)),
            )
            .subscribe((adSets) => {
              this.getFacebookAds(adSets, query);
            });
        }
      }),
    );
  }

  private getFacebookAds(adSets, query): void {
    this.adsApiService
      .insights({ query: query })
      .pipe(
        map((response) => response.data),
        map((allAds) => {
          if (allAds) {
            return {
              adSets: adSets.map((adSet) => ({
                ...adSet,
                expandRow: false,
                childAds: allAds
                  .filter((ad) => ad.adSet.id === adSet.id)
                  .map((ad) => ({
                    ...ad,
                    ...ad.insights?.summary,
                  })),
              })),
              ads: allAds.map((ad) => ({
                ...ad,
                ...ad.insights?.summary,
              })),
            };
          } else {
            return { adSets: adSets };
          }
        }),
        catchError(() => of(null)),
      )
      .subscribe((adSetsAndAds) => {
        this.campaignAdSets$.next(adSetsAndAds.adSets);
        if (adSetsAndAds.ads) {
          this.campaignAds$.next(adSetsAndAds.ads);
        }
      });
  }

  private getLinkedinAds(campaignId: string): void {
    const query = this.campaignDetailsService.getAdSetsAdsQuery(this.campaignQueryForm, campaignId);
    this.adsApiService
      .insights({ query: query })
      .pipe(
        map((response) => response.data),
        catchError(() => of(null)),
      )
      .subscribe((allAds) => this.campaignAds$.next(allAds));
  }

  private getLinkedinBudgetRemaining(campaignId: any): void {
    const query = this.campaignDetailsService.getLinkedInDailyQuery(campaignId);
    this.campaignApiService
      .insights({ query: query })
      .pipe(
        map((response) => response.data[0].insights?.summary.spend),
        catchError(() => of(null)),
      )
      .subscribe((spendToday) => (this.linkedinSpendToday = spendToday));
  }

  private emitDateRangeValueChanges(): void {
    this.subSink.sink = this.campaignQueryForm.valueChanges
      .pipe(switchMap((value: any) => this.setSelectedTimeInterval.emit(value.dateRange)))
      .subscribe();
  }
}
