import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'ingo-current-subscription',
  templateUrl: './current-subscription.component.html',
  styleUrls: ['./current-subscription.component.scss'],
})
export class CurrentSubscriptionComponent implements OnInit {
  @Output()
  changeSubscription = new EventEmitter();

  @ViewChild('paymentsModalContent')
  paymentsModalContent: TemplateRef<any>;

  public currentSubscription$: Observable<any>;

  constructor(private readonly subscriptionService: SubscriptionService, private modal: NzModalService) {}

  ngOnInit() {
    this.currentSubscription$ = this.subscriptionService.currentSubscription$.state$;
  }

  public openPaymentsModal(): void {
    this.modal.create({
      nzContent: (this.paymentsModalContent as any).modal,
      nzFooter: [],
      nzClassName: 'ingo-subscription-modal',
      nzWidth: '350px',
    });
  }
}
