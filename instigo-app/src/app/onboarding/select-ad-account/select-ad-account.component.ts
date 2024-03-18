import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdAccountSelectComponent } from '@app/features/ad-account-select/ad-account-select.component';
import { Store } from '@ngxs/store';
import { OnboardingService } from '../onboarding.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OnboardingState } from '../onboarding.state';
import { isEqual, uniqWith } from 'lodash-es';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-select-add-account',
  template: `<ng-template #modalCloseIcon><i class="far fa-times"></i></ng-template>

    <ng-template #connectAdAccountExplain>
      <div class="account-connect-explain">
        <h4>How to connect an ad account</h4>
        <p>
          To connect an ad account, select the check box next to it, then click on the
          <strong>Add Accounts</strong> button at the bottom right (you can select multiple accounts at the same time).
          Please note that only the <strong>workspace owner</strong> is able to add or remove accounts. To connect your
          own accounts, use a workspace that you own instead.
        </p>
        <h4>Why are some accounts already checked?</h4>
        <p>
          A checked box next to an ad account means that this ad account has already been connected to Instigo (either
          on this workspace or another). In order to be able to add that ad account to this workspace, you will have to
          contact the owner of the other workspace where this ad account is already connected, and ask them to remove
          it.
        </p>
      </div>
    </ng-template>

    <ng-template #connectAdAccountHeaderTemplate>
      <div>
        Select Ad Accounts
        <span
          class="account-selector-tooltip"
          nz-tooltip
          [nzTooltipTitle]="connectAdAccountExplain"
          nzTooltipOverlayClassName="ingo-explain-card connect-account-tooltip"
          nzTooltipColor="#5F63F2"
          nzTooltipPlacement="bottom"
        >
          How to connect an account
          <i class="fas fa-info-circle"></i>
        </span>
      </div>
    </ng-template> `,
})
export class SelectAdAccountComponent implements OnInit, OnDestroy {
  @ViewChild('modalCloseIcon', { static: true })
  modalCloseIcon!: TemplateRef<void>;

  @ViewChild('connectAdAccountHeaderTemplate', { static: true })
  connectAdAccountHeaderTemplate: TemplateRef<any>;

  public providers: { label: string; value: string }[];

  private subscription = new SubSink();

  constructor(
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private onboardingService: OnboardingService,
    private store: Store,
  ) {
    this.providers = [
      {
        label: 'Facebook',
        value: 'facebook',
      },
      {
        label: 'LinkedIn',
        value: 'linkedin',
      },
    ];
  }

  ngOnInit(): void {
    const provider = this.route.snapshot.params.provider;
    const selectedAccountModalRef = this.modalService.create({
      nzTitle: this.connectAdAccountHeaderTemplate,
      nzContent: AdAccountSelectComponent,
      nzClassName: 'ingo-modal-table',
      nzWrapClassName: 'vertical-center-modal',
      nzWidth: 820,
      nzCloseIcon: this.modalCloseIcon,
    });
    selectedAccountModalRef.componentInstance.provider = provider;
    this.subscription.sink = selectedAccountModalRef.afterClose.asObservable().subscribe((selectedAdAccounts) => {
      if (selectedAdAccounts && typeof selectedAdAccounts[Symbol.iterator] === 'function') {
        const selectedAccountFromState = this.store.selectSnapshot(OnboardingState.get).selectedAdAccounts;
        selectedAdAccounts = [
          ...(selectedAccountFromState?.filter((selected) => selected.provider !== provider) || []),
          ...(selectedAdAccounts || []),
        ];
        const uniqSelectedAdAccounts = uniqWith(selectedAdAccounts, isEqual);
        this.onboardingService.updateOnboarding.emit({ selectedAdAccounts: uniqSelectedAdAccounts });
      }
    });
  }

  private getProviderLabel(providerName: string): string {
    return this.providers.find(({ value }) => value === providerName).label;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
