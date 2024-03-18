import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserState } from '@app/global/user.state';
import { AdAccountDTO, DateTimeInterval, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { SelectSnapshot, ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { WorkspaceState } from '../../state/workspace.state';
import { InitializeDashboard, SessionState } from '../session-state.state';

@Component({
  selector: 'adaccount-dashboard',
  templateUrl: './adaccount-dashboard.component.html',
  styleUrls: ['./adaccount-dashboard.component.scss'],
})
export class AdAccountDashboardComponent implements OnInit, OnDestroy {
  @ViewSelectSnapshot(UserState.greeting)
  public dashboardGreeting: string;

  @Select(SessionState.selectedAdAccount)
  public selectedAdAccount$: Observable<AdAccountDTO>;

  @Select(WorkspaceState.get)
  public workspace$: Observable<WorkspaceDTO>;

  @Select(WorkspaceState.adAccountsList)
  public adAccountsList$: Observable<AdAccountDTO[]>;

  public dashboardForm: FormGroup;

  @Emitter(SessionState.setDateTimeInterval)
  private setSelectedTimeInterval: Emittable<DateTimeInterval>;

  @Emitter(SessionState.update)
  private updateDashboard: Emittable<any>;

  @SelectSnapshot(SessionState.selectedTimeInterval)
  private selectedTimeInterval: DateTimeInterval;

  private subscriptions = new SubSink();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  public get dateRange1() {
    return this.dashboardForm.get('dateRange1');
  }

  private get dateRange2() {
    return this.dashboardForm.get('dateRange2');
  }

  ngOnInit() {
    this.store.dispatch(new InitializeDashboard());
    this.dashboardForm = this.formBuilder.group({
      adAccount: [null],
      dateRange1: [],
      dateRange2: [],
    });

    this.listenOnAdAccountChangeAndUpdateDashboardForm();
    this.listenOnParamsAndPatchTheDashboardForm();
    this.listenOnDashboardChangesAndAct();
    this.listenOnDateRangesAndUpdate();
    this.initializeDatePiker();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public initializeDatePiker(): void {
    this.dateRange1.setValue({
      dateRange: this.selectedTimeInterval.dateRange,
    });
  }

  private listenOnAdAccountChangeAndUpdateDashboardForm(): void {
    this.subscriptions.sink = this.selectedAdAccount$.subscribe((selectedAdAccount) => {
      this.dashboardForm.patchValue({ adAccount: selectedAdAccount });
    });
  }

  private listenOnParamsAndPatchTheDashboardForm(): void {
    this.subscriptions.sink = this.activeRoute.queryParams
      .pipe(
        mergeMap((params) => {
          if (params['id']) {
            return this.workspace$.pipe(
              take(1),
              tap((workspace) => {
                const accountFromRoute = workspace.adAccounts.find((account) => account.id === params['id']);
                this.dashboardForm.patchValue({ adAccount: accountFromRoute });
              }),
            );
          } else {
            return of();
          }
        }),
      )
      .subscribe();
  }

  private listenOnDashboardChangesAndAct(): void {
    this.subscriptions.sink = this.dashboardForm.valueChanges
      .pipe(
        tap((value: any) => {
          if (value.adAccount) {
            const queryParams: Params = { id: value.adAccount.id };
            void this.router.navigate([], { relativeTo: this.activeRoute, queryParams: queryParams });
            this.updateDashboard.emit({ selectedAdAccount: value.adAccount });
            this.setSelectedTimeInterval.emit(value.dateRange1);
          }
        }),
      )
      .subscribe();
  }

  private listenOnDateRangesAndUpdate(): void {
    this.subscriptions.sink = this.dateRange1.valueChanges.subscribe((v) =>
      this.dateRange2.setValue(v, { emitEvent: false }),
    );
    this.subscriptions.sink = this.dateRange2.valueChanges.subscribe((v) =>
      this.dateRange1.setValue(v, { emitEvent: false }),
    );
  }
}
