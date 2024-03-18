import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { ObservableLoadingInterface } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { format } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { userInitials, WorkspaceCardData } from '../../workspace-dashboard-utils';
@Component({
  selector: 'ingo-workspace-overview-card',
  templateUrl: './workspace-overview.component.html',
})
export class WorkspaceOverviewComponent implements OnInit, OnDestroy {
  @Input()
  workspace$: Observable<ObservableLoadingInterface<any>>;

  public workspaceData: BehaviorSubject<WorkspaceCardData> = new BehaviorSubject(null);

  @SelectSnapshot(WorkspaceState.isSubscriptionActive)
  private isSubscriptionActive: any;

  private subscription = new SubSink();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.subscription.sink = this.workspace$
      .pipe(
        tap((res) => {
          if (this.workspaceData.value === null) {
            this.workspaceData.next(res?.value ? this.prepWorkspaceValues(res.value) : null);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private prepWorkspaceValues(workspace: any): WorkspaceCardData {
    return {
      name: workspace.name,
      linkedinCount: workspace.stats.adAccountsProviderBreakdown?.linkedin,
      facebookCount: workspace.stats.adAccountsProviderBreakdown?.facebook,
      created: format(new Date(workspace.createdAt), 'dd/MM/yyyy'),
      updated: format(new Date(workspace.updatedAt), 'dd/MM/yyyy'),
      initials: userInitials(workspace.name),
      isActive: workspace.disabled ? 'Inactive' : 'Active',
      adAccountsCount: workspace.adAccounts.length,
      adAccountsLimit: Math.floor((workspace.adAccounts.length / 15) * 100),
      managedBy: workspace.owner.fullName,
      subscription: {
        type: this.isSubscriptionActive ? 'PREMIUM' : 'INACTIVE',
      },
    };
  }
}
