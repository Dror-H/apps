import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { adTemplateTypes, getAdAccountsByProviderWholeObj } from '@app/global/utils';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-ad-template-create',
  templateUrl: './new-ad-template-create.component.html',
  styleUrls: ['./new-ad-template-create.component.scss'],
})
export class NewAdTemplateCreateComponent implements OnInit {
  @Input()
  adTemplateForm: FormGroup;

  @Output()
  createAdTemplate = new EventEmitter<void>();

  @ViewSelectSnapshot(WorkspaceState.adAccountsFormList)
  public adNetworks: any;

  public nzSelectAdAccounts: NzSelectOptionInterface[] = [];
  public adTemplateTypes = adTemplateTypes;

  public get settings(): FormGroup {
    return this.adTemplateForm.get('settings') as FormGroup;
  }

  public get adAccountControl(): FormControl {
    return this.settings.get('adAccount') as FormControl;
  }

  ngOnInit(): void {
    this.nzSelectAdAccounts = getAdAccountsByProviderWholeObj(this.adNetworks, this.settings.value.provider);

    this.adAccountControl.setValue(this.nzSelectAdAccounts[0]?.value);
    this.settings.controls['provider'].valueChanges.subscribe((changes) => {
      this.nzSelectAdAccounts = getAdAccountsByProviderWholeObj(this.adNetworks, changes);
      if (this.nzSelectAdAccounts.length < 1) {
        this.settings.patchValue({ adAccount: null });
      } else {
        this.adAccountControl.setValue(this.nzSelectAdAccounts[0].value);
      }
    });
  }
}
