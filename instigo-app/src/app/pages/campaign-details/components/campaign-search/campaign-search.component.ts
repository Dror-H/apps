import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { CampaignDTO } from '@instigo-app/data-transfer-object';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { from, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'ingo-campaign-details-search',
  templateUrl: './campaign-search.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampaignSearchComponent),
      multi: true,
    },
  ],
})
export class CampaignSearchComponent extends ControlValueAccessorBaseHelper implements OnInit {
  public searchActive = false;
  public searchItems$: Subject<string> = new Subject();
  public campaignSearched: CampaignDTO;

  @Input()
  public selectedSearchItem?: CampaignDTO;

  constructor(private readonly campaignApiService: CampaignApiService) {
    super();
  }

  get selectedCampaignName(): string {
    return this.selectedSearchItem ? this.selectedSearchItem.name : 'Loading...';
  }

  ngOnInit(): void {
    this.searchItems$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term: string) => term && term.length >= 3),
        switchMap((term: string) => this.searchCampaign(term)),
        tap((result) => (this.campaignSearched = result)),
      )
      .subscribe();
  }

  public onSelect(event: any): void {
    this.searchActive = false;
    this.onChanged(event);
  }

  public toggleActive(): void {
    this.searchActive = !this.searchActive;
  }

  private query(term): string {
    const qb = RequestQueryBuilder.create();
    const query = qb.setLimit(10);
    query.setFilter({ field: 'name', operator: CondOperator.CONTAINS_LOW, value: term });
    return query.query();
  }

  private searchCampaign(term: string): Observable<any> {
    return this.campaignApiService.findAll(this.query(term)).pipe(
      switchMap((campaigns) => from(campaigns)),
      map((campaign: any) => campaign),
      toArray(),
    );
  }
}
