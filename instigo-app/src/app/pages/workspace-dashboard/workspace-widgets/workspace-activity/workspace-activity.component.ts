import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationApiService } from '@app/api/services/notification-api.service';
import { WorkspaceDashboardService } from '@app/pages/workspace-dashboard/workspace-dashboard.service';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { WorkspaceActivity } from '../../workspace-dashboard-utils';

@Component({
  selector: 'ingo-workspace-activity',
  templateUrl: './workspace-activity.component.html',
  styleUrls: ['workspace-activity.component.scss'],
})
export class WorkspaceActivityComponent implements OnInit, OnDestroy {
  public viewMoreBtn = false;
  public loadingMore = false;
  public itemsToLoad = 10;
  public workspaceActivity$ = new BehaviorSubject<WorkspaceActivity[]>(null);

  private subscription = new SubSink();

  constructor(
    private readonly notificationApiService: NotificationApiService,
    private readonly workspaceDashboardService: WorkspaceDashboardService,
  ) {}

  ngOnInit(): void {
    this.loadActivity();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadActivity(): void {
    this.loadingMore = true;
    this.subscription.add(
      this.workspaceDashboardService
        .workspaceActivity({ takeNo: this.itemsToLoad })
        .pipe(
          tap((result: any) => {
            this.viewMoreBtn = this.itemsToLoad < result?.count;
            this.loadingMore = false;
            this.itemsToLoad += 10;
            this.workspaceActivity$.next(result?.data || []);
          }),
          take(1),
        )
        .subscribe(),
    );
  }

  public markActivityRead(activity: any): void {
    activity.read = true;
    this.subscription.add(
      this.notificationApiService
        .markAsRead({ notification: [activity.raw] })
        .pipe(take(1))
        .subscribe(),
    );
  }
}
