import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { ObservableLoadingInterface } from '@instigo-app/data-transfer-object';
import { User } from '@instigo-app/data-transfer-object';
import { format } from 'date-fns';
import { map, skip, tap } from 'rxjs/operators';
import { userInitials } from '../../workspace-dashboard-utils';
import { SubSink } from 'subsink';
@Component({
  selector: 'ingo-workspace-widget-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
  @Input()
  public members$: Observable<ObservableLoadingInterface<User[]>>;

  @SelectSnapshot(WorkspaceState.workspaceId)
  workspaceId: Observable<string>;

  public viewAllBtn: boolean = false;
  public userInitials = userInitials;

  private subscription = new SubSink();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // TODO
    // Consult with Andy why when I use *ngIf="(members$ | async).value[0]?.length > 6" I get an undefined error in the console.
    // This should be removed and use *ngIf on the button instead
    this.subscription.sink = this.members$
      .pipe(
        skip(1),
        map((result) => result),
        tap((dataset) => (this.viewAllBtn = dataset.value[0]?.length > 6)),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public lastLogin(time): string {
    return format(new Date(time), 'dd/MM/yyyy');
  }

  public viewAll() {
    void this.router.navigate(['/account-control/workspaces/details', this.workspaceId]);
  }
}
