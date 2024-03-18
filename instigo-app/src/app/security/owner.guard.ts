import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { WorkspaceState } from '../pages/state/workspace.state';
import { DisplayNotification, Notification, NotificationType } from '../global/display-notification.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerGuard implements CanActivate {
  @SelectSnapshot(WorkspaceState.isWorkspaceOwner)
  private isWorkspaceOwner: boolean;

  constructor(private displayNotification: DisplayNotification) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isWorkspaceOwner) {
      this.displayNotification.displayNotification(
        new Notification({
          content: `You need to be the owner of the current workspace`,
          type: NotificationType.WARNING,
        }),
      );
    }

    return this.isWorkspaceOwner;
  }
}
