import { Component, Inject, OnInit } from '@angular/core';
import { AdAccountDTO, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { STORE } from '@instigo-app/ui/shared';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'audi-account-selector-container',
  templateUrl: './ad-account-selector-container.component.html',
  styleUrls: ['./ad-account-selector-container.component.scss'],
})
export class AdAccountSelectorContainerComponent implements OnInit {
  public adAccountList: AdAccountDTO[];
  public group: FormGroup;
  public supportedProviders = SupportedProviders;
  public targeting: TargetingDto;

  constructor(private fb: FormBuilder, @Inject(STORE) private store: Store, private _modalRef: NzModalRef) {
    this.group = fb.group({
      account: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.store.selectSnapshot((state) => {
      this.adAccountList = state.user.adAccounts;
    });
  }

  public exportToFacebook(): void {
    this._modalRef.close(this.group.get('account').value);
  }
}
