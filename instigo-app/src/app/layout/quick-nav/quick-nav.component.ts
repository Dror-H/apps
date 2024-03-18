import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdSetApiService } from '@app/api/services/ad-set.api.service';
import { AdApiService } from '@app/api/services/ad.api.service';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Select } from '@ngxs/store';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { QuickNavData } from './quick-nav.data';

@Component({
  selector: 'app-quick-nav',
  templateUrl: './quick-nav.component.html',
  styleUrls: ['./quick-nav.component.scss'],
})
export class QuickNavComponent implements OnInit, OnDestroy {
  @Select(WorkspaceState.isSubscriptionActive)
  public isSubscriptionActive: Observable<boolean>;
  @Select(WorkspaceState.get)
  public workspace: Observable<WorkspaceDTO>;
  @Select(UserState.get)
  public user: Observable<User>;
  public isActive = false;
  public selectedQuickNavItem?: string;
  public items: any;
  public searchStarted: boolean;
  public term = new Subject();

  private subSink = new SubSink();

  constructor(
    private router: Router,
    private readonly campaignApiService: CampaignApiService,
    private readonly adSetApiService: AdSetApiService,
    private readonly adApiService: AdApiService,
  ) {}

  ngOnInit() {
    this.subSink.sink = this.term
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((term: string) => term && term.length >= 3),
        switchMap((term: string) =>
          combineLatest([
            this.searchInPages(term),
            this.searchCampaign(term),
            this.searchAdSet(term),
            this.searchAd(term),
          ]),
        ),
      )
      .subscribe((result) => (this.items = result));
  }

  public upgradeSub(): any {
    return this.router.navigate(['/account-control/workspaces']);
  }

  public redirectToWorkspaceWhenNoSub(): any {
    this.subSink.sink = this.isSubscriptionActive.subscribe((isActive: boolean) => {
      if (!isActive) {
        void this.router.navigate(['/account-control/workspaces']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public searchTerm(term: string): void {
    this.term.next(term);
  }

  public resetInput(): void {
    this.selectedQuickNavItem = '';
  }

  public onSelect(event: any): void {
    this.isActive = false;
    if (event.provider) {
      void this.router.navigate([event.path], { queryParams: { provider: event.provider } });
      return;
    }
    void this.router.navigate([event.path]);
  }

  public toggleActive(): void {
    this.isActive = !this.isActive;
  }

  private searchInPages(term: string): Observable<any> {
    return from(QuickNavData()).pipe(
      filter((page) => page.label.toLowerCase().includes(term.toLowerCase())),
      toArray(),
      map((pages) => ({
        label: 'Pages',
        children: pages,
        more: '',
        morePath: '',
      })),
    );
  }

  private query(term): string {
    const qb = RequestQueryBuilder.create();
    const query = qb.setLimit(5);
    query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: term });
    return query.query();
  }

  private searchCampaign(term: string): Observable<any> {
    return this.campaignApiService.findAll(this.query(term)).pipe(
      switchMap((campaigns) => from(campaigns)),
      map((campaign: any) => ({
        label: campaign.name,
        iconType: 'fontawesome',
        iconTheme: 'fas',
        icon: 'bullhorn',
        path: `/campaign-details/${campaign.id}`,
        status: campaign.status,
        provider: campaign.provider,
      })),
      toArray(),
      map((campaigns) => ({
        label: 'Campaigns',
        more: 'View All',
        morePath: '/campaigns',
        children: campaigns,
      })),
    );
  }

  private searchAdSet(term: string): Observable<any> {
    return this.adSetApiService.findAll(this.query(term)).pipe(
      switchMap((adsets) => from(adsets)),
      map((adSet: any) => ({
        label: adSet.name,
        path: `/campaign-details/${adSet.campaign.id}`,
        iconType: 'fontawesome',
        iconTheme: 'fas',
        icon: 'bullhorn',
        status: adSet.status,
      })),
      toArray(),
      map((adsets) => ({
        label: 'Ad Sets',
        more: 'View All',
        morePath: '/campaigns',
        children: adsets,
      })),
    );
  }

  private searchAd(term: string): Observable<any> {
    return this.adApiService.findAll(this.query(term)).pipe(
      switchMap((ads) => from(ads)),
      map((ad: any) => ({
        label: ad.name,
        path: `/campaign-details/${ad.campaign.id}`,
        iconType: 'fontawesome',
        iconTheme: 'fas',
        icon: 'bullhorn',
        status: ad.status,
      })),
      toArray(),
      map((ad) => ({
        label: 'Ads',
        more: 'View All',
        morePath: '/campaigns',
        children: ad,
      })),
    );
  }
}
