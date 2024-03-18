import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogoutService } from '@app/global/logout.service';
import { UserState } from '@app/global/user.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { MeDTO, User } from '@instigo-app/data-transfer-object';
import { UserDashboardControlCardUserInfo, UserDashboardControlListItem } from '@instigo-app/ui/shared';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { Merge } from 'type-fest';
import { controlCardListItems, workspaceOwnerListItems } from './card-control.data';

@Component({
  selector: 'app-card-control',
  templateUrl: './card-control.component.html',
  styleUrls: ['../account-control.component.scss'],
})
export class CardControlComponent implements OnInit, OnDestroy {
  @ViewSelectSnapshot(WorkspaceState.isWorkspaceOwner) isWorkspaceOwner: boolean;
  @Select(UserState.get) user$: Observable<User>;
  @Select(WorkspaceState.isWorkspaceOwner) isWorkspaceOwner$: Observable<boolean>;

  public controlCardUserInfo: UserDashboardControlCardUserInfo;
  public controlCardListItems: UserDashboardControlListItem[];

  private subscriptions = new SubSink();

  constructor(private readonly logoutService: LogoutService) {}

  ngOnInit(): void {
    this.subscribeToUser();
    this.subscribeToWorkspaceOwner();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public logout(): void {
    this.logoutService.logout();
  }

  private setControlCardUserInfo(user: Merge<Partial<MeDTO>, User>): void {
    const lastLogin = format(new Date(user.updatedAt), 'dd/MM/yyyy');
    const memberSince = format(new Date(user.createdAt), 'dd/MM/yyyy ');
    this.controlCardUserInfo = {
      lastLogin,
      memberSince,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      pictureUrl: user.pictureUrl || 'assets/icons/avatar.png',
    };
  }

  private setControlCardListItems(isWorkspaceOwner: boolean): void {
    this.controlCardListItems = isWorkspaceOwner
      ? controlCardListItems.concat(workspaceOwnerListItems)
      : controlCardListItems;
  }

  private subscribeToWorkspaceOwner(): void {
    this.subscriptions.sink = this.isWorkspaceOwner$.subscribe((isWorkspaceOwner) => {
      this.setControlCardListItems(isWorkspaceOwner);
    });
  }
  private subscribeToUser(): void {
    this.subscriptions.sink = this.user$.subscribe((user) => {
      this.setControlCardUserInfo(user);
    });
  }
}
