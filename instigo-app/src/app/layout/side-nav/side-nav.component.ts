import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '@app/global/logout.service';
import { UserState } from '@app/global/user.state';
import { SideNavInterface } from '@app/layout/side-nav/side-nav.type';
import { SyncWorkspace, WorkspaceState } from '@app/pages/state/workspace.state';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { sideNavButtons, sideNavRoutes } from './side-nav-routes.config';

@Component({
  selector: 'ingo-sidenav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  public menuItems: SideNavInterface[] = sideNavRoutes;
  public menuButtons: SideNavInterface[] = sideNavButtons;
  public isOwner: boolean;

  @Input() colorScheme: string;
  @Input() isCollapsed: boolean;
  @Output() menuCollapsed = new EventEmitter();

  @Select(UserState.get)
  public user: Observable<User>;

  @Select(WorkspaceState.isSubscriptionActive)
  public isSubscriptionActive: Observable<boolean>;

  @Select(WorkspaceState.get)
  public workspace: Observable<WorkspaceDTO>;

  constructor(private store: Store, private readonly router: Router, private readonly logoutService: LogoutService) {}

  public slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w-]+/g, ' ')
      .replace(/\s+/g, '-');
  }

  public getTestId(str) {
    return `${str
      .toLowerCase()
      .trim()
      .replace(/[^\w-]+/g, ' ')
      .replace(/\s+/g, '-')}-side-bar-button`;
  }

  public plusButton(e, type) {
    e.preventDefault();
    e.stopPropagation();
    void this.router.navigate([type]);
  }

  public handleCallback(type) {
    if (type !== 'DATA_SYNC') return;

    const types = {
      ['DATA_SYNC']: () => {
        this.store.dispatch(new SyncWorkspace());
      },
    };
    types[type]();
  }

  public isMenuCollapsed() {
    this.menuCollapsed.emit();
  }

  public logout() {
    this.logoutService.logout();
  }

  public upgradeSub() {
    return this.router.navigate(['/account-control/workspaces']);
  }
}
