import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdAccountDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { SubSink } from 'subsink';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { MultiVariateCreativesService } from '../../../../../services/multi-variate-creatives.service';
import { handleCampaignObjective } from '@app/global/utils';

@Component({
  selector: 'ingo-facebook-video-multi-variate',
  templateUrl: './facebook-video-multi-variate.component.html',
  styleUrls: ['./facebook-video-multi-variate.component.scss'],
})
export class FacebookVideoMultiVariateComponent implements OnInit, OnDestroy {
  @Input() multivariateVideoForm = new FormGroup({});
  @Input() campaignObjective: string = null;
  public provider = SupportedProviders.FACEBOOK;
  public adAccount: AdAccountDTO;

  @SelectSnapshot(WorkspaceState.adAccountsFormList) adNetworks: any;
  private subscriptions = new SubSink();

  constructor(private fb: FormBuilder, private multiVariateService: MultiVariateCreativesService) {}

  public get adAccountForm(): FormControl {
    return this.multivariateVideoForm.parent.parent.parent.get('settings.account') as FormControl;
  }

  ngOnInit(): void {
    this.adAccount = this.adAccountForm.value;
    handleCampaignObjective(this.campaignObjective, this.multivariateVideoForm);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public addControl(name: string): void {
    this.multiVariateService.addControl(name, this.multivariateVideoForm);
  }

  public removeControl(formArray: AbstractControl, index: number): void {
    if (index > 0) {
      (formArray as FormArray).removeAt(index);
    }
  }
}
