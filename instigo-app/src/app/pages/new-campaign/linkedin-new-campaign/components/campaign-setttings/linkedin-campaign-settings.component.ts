import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdAccountDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { linkedinCampaignObjective } from '../../linkedin-new-campaign.data';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { WorkspaceState } from '@app/pages/state/workspace.state';

@Component({
  selector: 'ingo-linkedin-campaign-settings',
  templateUrl: './linkedin-campaign-settings.component.html',
})
export class LinkedinCampaignSettingsComponent implements OnInit {
  @Input() settingsForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
  @SelectSnapshot(WorkspaceState.getAdAccountList) private adAccounts: AdAccountDTO[];

  public supportedProviders = SupportedProviders;
  public linkedinCampaignObjective = linkedinCampaignObjective;
  public adAccountList: AdAccountDTO[];

  ngOnInit(): void {
    this.adAccountList = this.adAccounts.filter((item) => item.provider === SupportedProviders.FACEBOOK);
  }
}
