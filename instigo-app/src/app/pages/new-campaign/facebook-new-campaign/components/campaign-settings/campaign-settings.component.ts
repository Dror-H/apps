import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdAccountDTO, SupportedProviders } from '@instigo-app/data-transfer-object';
import { campaignSpecialCats, facebookCampaignObjectives } from '../../facebook-new-campaign.data';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { WorkspaceState } from '@app/pages/state/workspace.state';

@Component({
  selector: 'ingo-nc-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  styleUrls: ['./campaign-settings.component.scss'],
})
export class NCCampaignSettingsComponent implements OnInit {
  @Input() settingsForm = new FormGroup({});
  @Output() setStep = new EventEmitter<void>();
  public specialCatsOptions = campaignSpecialCats;
  public specialCatsSelected: string;
  public supportedProviders = SupportedProviders;
  public facebookCampaignObjectives = facebookCampaignObjectives;
  public adAccountList: AdAccountDTO[];
  @SelectSnapshot(WorkspaceState.getAdAccountList) private adAccounts: AdAccountDTO[];

  ngOnInit(): void {
    this.adAccountList = this.adAccounts.filter((item) => item.provider === SupportedProviders.FACEBOOK);
  }

  public updateSpecialCats(selected: string[]): void {
    switch (selected?.length) {
      case 1:
        this.specialCatsSelected = selected[0];
        break;
      case 2:
        this.specialCatsSelected = selected.join(' and ');
        break;
      default:
        if (selected?.length > 2) {
          const lastSelected = selected.slice(-1);
          this.specialCatsSelected = selected.slice(0, -1).join(', ') + ' & ' + lastSelected;
        } else {
          this.specialCatsSelected = '';
        }
        break;
    }
  }
}
