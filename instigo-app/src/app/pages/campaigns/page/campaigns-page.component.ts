import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionState } from '@app/pages/adaccount-dashboard/session-state.state';
import { DateTimeInterval } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { CampaignsViewService } from '../campaigns-view.service';
import { QuickActionsService } from '../quick-actions.service';

@Component({
  selector: 'app-campaigns-page-component',
  templateUrl: './campaigns-page.component.html',
  styleUrls: ['./campaigns-page.component.scss'],
  providers: [CampaignsViewService, QuickActionsService],
})
export class CampaignsPageComponent implements OnInit, OnDestroy {
  public selectedCampaignsLength$: Observable<number>;
  public selectedAdSetsLength$: Observable<number>;
  public filters$: Observable<any>;
  public activeTab$: BehaviorSubject<number>;
  public campaignsDatesForm: FormGroup;

  @Emitter(SessionState.setDateTimeInterval)
  private setSelectedTimeInterval: Emittable<DateTimeInterval>;

  private subscriptions = new SubSink();

  constructor(private readonly formBuilder: FormBuilder, private readonly campaignsViewService: CampaignsViewService) {}

  ngOnInit() {
    this.activeTab$ = this.campaignsViewService.activeTab$;
    this.filters$ = this.campaignsViewService.filters$;
    this.selectedCampaignsLength$ = this.campaignsViewService.campaignsTableState$.pipe(
      map((state: any) => state.selectedItems?.length as number),
    );
    this.selectedAdSetsLength$ = this.campaignsViewService.adSetsTableState$.pipe(
      map((state: any) => state.selectedItems?.length as number),
    );

    this.campaignsDatesForm = this.formBuilder.group({
      dateRange: [this.campaignsViewService.filters$.value.datePreset],
    });

    this.subscriptions.sink = this.dateRange.valueChanges.subscribe((datePreset: any) => {
      this.setSelectedTimeInterval.emit(datePreset);
      this.updateFilterState({ datePreset });
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public get dateRange() {
    return this.campaignsDatesForm.get('dateRange');
  }

  public deselectCampaigns(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.campaignsViewService.updateCampaignsViewTableState({ allRowsSelected: false, selectedItems: [] });
    this.campaignsViewService.updateAdSetsViewTableState({ allRowsSelected: false, selectedItems: [] });
  }

  public deselectAdSets(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.campaignsViewService.updateAdSetsViewTableState({ allRowsSelected: false, selectedItems: [] });
  }

  public updateFilterState(value: Partial<any>) {
    this.campaignsViewService.updateFilters(value);
  }
}
