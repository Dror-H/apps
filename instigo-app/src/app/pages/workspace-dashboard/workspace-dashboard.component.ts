import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { WorkspaceDashboardService } from '@app/pages/workspace-dashboard/workspace-dashboard.service';
import { ObservableType } from '@instigo-app/data-transfer-object';
import { User } from '@instigo-app/data-transfer-object';
import { Select } from '@ngxs/store';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'instigo-app-workspace-dashboard',
  templateUrl: './workspace-dashboard.component.html',
  styleUrls: ['./workspace-dashboard.component.scss'],
})
export class WorkspaceDashboardComponent implements OnInit, OnDestroy {
  @Select(UserState.greeting)
  public greeting$: Observable<string>;
  @Select(UserState.get)
  public user$: Observable<User>;
  @Select(WorkspaceState.totalAdAccounts)
  public totalAdAccounts$: Observable<number>;
  public internalDatePresets: any;
  public members$: Observable<any>;
  public adAccounts$: BehaviorSubject<any> = new BehaviorSubject({ type: ObservableType.START });
  public workspaceInsights$: BehaviorSubject<any> = new BehaviorSubject({ type: ObservableType.START });
  public workspaceStats$: BehaviorSubject<any> = new BehaviorSubject({ type: ObservableType.START });
  public workspaceData$: BehaviorSubject<any> = new BehaviorSubject({ type: ObservableType.START });
  public activeTab$: BehaviorSubject<number> = new BehaviorSubject(0);
  private subSink = new SubSink();

  constructor(private service: WorkspaceDashboardService) {}

  ngOnInit(): void {
    this.internalDatePresets = this.service.datePresets;
    this.members$ = this.service.workspaceMembers();
    this.subSink.sink = this.totalAdAccounts$
      .pipe(
        mergeMap((adAccountTotal) => {
          if (adAccountTotal > 0) {
            return this.service.get().pipe(
              tap((result) => {
                this.adAccounts$.next({ type: result.type, value: result.value?.adAccounts });
                this.workspaceInsights$.next({ type: result.type, value: result.value?.insights });
                this.workspaceStats$.next({ type: result.type, value: result.value?.stats });
                this.workspaceData$.next({ type: result.type, value: result?.value });
              }),
            );
          } else {
            return of(EMPTY);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public viewAllActivity(): void {
    this.activeTab$.next(2);
  }

  public changeRange(timeframe: any) {
    this.service.currentDatePreset$.next(timeframe);
  }

  public isActiveRange(label) {
    return label === this.service.currentDatePreset$.value.value;
  }
}
