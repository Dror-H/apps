import { Component } from '@angular/core';
import { UserState } from '@audience-app/store/user.state';
import { User } from '@instigo-app/data-transfer-object';
import { ChangePlanSummaryContentComponent, UserPaymentInfo } from '@instigo-app/ui/shared';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'ingo-user-subscription-container',
  templateUrl: 'user-subscription-container.component.html',
})
export class UserSubscriptionContainerComponent {
  @ViewSelectSnapshot(UserState.getUserAndAdAccounts) userInfo: User;

  constructor(private readonly modalService: NzModalService) {}

  public handleOnPay(paymentInfo: UserPaymentInfo): void {
    console.log(paymentInfo);
    // on modal ok => pay

    this.modalService.create({
      nzContent: ChangePlanSummaryContentComponent,
      nzComponentParams: {
        total: 19,
        currentPaymentMethod: '',
        nextRenew: new Date(),
        billingCycle: 'monthly',
        upgradableSubscription: false,
      },
      nzMaskClosable: false,
      nzClassName: 'ingo-subscription-modal confirm-modal',
      nzWidth: '500px',
    });
  }
}
