import { Component, Input, OnInit } from '@angular/core';
import { AdSetWithAds } from '@instigo-app/data-transfer-object';
import { BehaviorSubject } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { maxBy, minBy } from 'lodash-es';

// TODO: This is not used, what should happen with this now?
@Component({
  selector: 'ingo-campaign-adsets-comparison',
  templateUrl: './campaign-adsets-comparison.component.html',
})
export class CampaignAdSetsComparisonComponent implements OnInit {
  @Input()
  campaignAdSets$: BehaviorSubject<any>;

  public allAdSets$: BehaviorSubject<AdSetWithAds[]> = new BehaviorSubject(null);
  public allAds$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  public winnerAdSetRef: any;

  constructor() {}

  ngOnInit(): void {
    this.campaignAdSets$
      .pipe(
        skip(1),
        map((result) => result),
      )
      .subscribe((result) => {
        this.allAdSets$.next(result);
        let allAds = [];
        result.map((d) => d.childAds).forEach((v) => allAds.push(...v));
        this.allAds$.next(allAds);
        this.compareAdSets(result);
      });
  }

  public compareAdSets(adSets: Array<any>) {
    this.winnerAdSetRef = {
      ctr: maxBy(adSets, 'ctr')['ctr'],
      cpc: minBy(adSets, 'cpc')['cpc'],
      cpp: minBy(adSets, 'cpp')['cpp'],
      cpa: minBy(adSets, 'cpa')['cpa'],
      cpm: minBy(adSets, 'cpm')['cpm'],
      impressions: maxBy(adSets, 'impressions')['impressions'],
      clicks: maxBy(adSets, 'clicks')['clicks'],
      reach: maxBy(adSets, 'reach')['reach'],
      conversions: maxBy(adSets, 'conversions'['conversions']),
    };
  }
}
