import { Injectable } from '@angular/core';
import { AuthComponent } from '@audience-app/auth/auth.component';
import { AuthAction } from '@audience-app/auth/auth.models';
import { ModalOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AdAccountSelectorContainerComponent } from '@audience-app/shared/components/ad-account-selector-container/ad-account-selector-container.component';
import { TargetingDto } from '@instigo-app/data-transfer-object';

@Injectable()
export class ModalService {
  private _modalRef: NzModalRef;

  constructor(private modal: NzModalService) {}

  public create(modalOptions: ModalOptions): NzModalRef {
    this._modalRef = this.modal.create(modalOptions);
    return this._modalRef;
  }

  public openAuthModal(authAction: AuthAction): NzModalRef {
    const modalConfig: ModalOptions = {
      nzCentered: true,
      nzContent: AuthComponent,
      nzComponentParams: { authAction },
      nzFooter: null,
      nzClassName: 'auth-modal',
      nzWrapClassName: 'auth-modal-wrapper',
      nzClosable: true,
      nzAutofocus: null,
    };

    this._modalRef = this.modal.create(modalConfig);
    return this._modalRef;
  }

  public openAdAccountSelectorModal(targeting: TargetingDto): NzModalRef {
    const modalConfig: ModalOptions = {
      nzCentered: true,
      nzContent: AdAccountSelectorContainerComponent,
      nzComponentParams: { targeting },
      nzFooter: null,
      nzClassName: 'ad-account-modal',
      nzWidth: 600,
      nzAutofocus: null,
    };

    this._modalRef = this.modal.create(modalConfig);
    return this._modalRef;
  }

  public openOnOK(linkToFacebook: string): void {
    this.modal.confirm({
      nzTitle: '<i>Redirect to Facebook campaign manager</i>',
      nzContent: `<p>In order to create a saved audience on facebook we created a campaign and an ad-set on Facebook manager.</p>`,
      nzOkText: 'Take me there',
      nzCancelText: 'Later',
      nzAutofocus: null,
      nzOnOk: () => window.open(linkToFacebook, '_blank'),
    });
  }

  public closeModal(): void {
    if (this._modalRef) {
      this._modalRef.close();
    }
  }
}
