import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NoActiveSubscriptionModalComponent } from '@audience-app/auth/no-active-subscription-modal/no-active-subscription-modal.component';
import { User } from '@audience-app/global/models/app.models';
import { ModalService } from '@audience-app/global/services/modal/modal.service';
import { UserState } from '@audience-app/store/user.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHasSubscriptionGuard implements CanActivate {
  @SelectSnapshot(UserState.getUserAndAdAccounts) user: User;

  constructor(private modal: ModalService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.user.stripeSubscriptionId) {
      const modalConfig: ModalOptions = {
        nzCentered: true,
        nzContent: NoActiveSubscriptionModalComponent,
        nzFooter: null,
        nzClassName: 'active-subscription-modal',
        nzWrapClassName: 'active-subscription-modal-wrapper',
        nzAutofocus: null,
      };
      this.modal.create(modalConfig);
      return false;
    }

    return true;
  }
}
