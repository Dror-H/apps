import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DisplayNotification } from '@app/global/display-notification.service';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionGuard implements CanActivate {
  @Select(WorkspaceState.isSubscriptionActive)
  private readonly isSubscriptionActive: any;

  constructor(private readonly displayNotification: DisplayNotification, private readonly store: Store) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isSubscriptionActive.pipe(
      map((isSubscriptionActive) => {
        if (isSubscriptionActive) {
          return true;
        }
        return this.store.dispatch([new Navigate(['/account-control/workspaces'])]).pipe(map(() => false));
      }),
    );
  }
}
