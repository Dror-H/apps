import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getAdAccountsByProviderWholeObj } from '@app/global/utils';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { AudienceSubType, AudienceType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-audience-type-selector',
  templateUrl: './audience-type-selector.component.html',
  styleUrls: ['./audience-type-selector.component.scss'],
})
export class AudienceTypeSelectorComponent implements OnInit, OnDestroy {
  @Input() audienceForm: FormGroup;
  @Output() setStep = new EventEmitter<number>();
  @ViewSelectSnapshot(WorkspaceState.adAccountsFormList) public adNetworks: any;

  public adAccountList: NzSelectOptionInterface[];
  public audienceType = AudienceType;
  public audienceSubType = AudienceSubType;
  public supportedProviders = SupportedProviders;
  public audienceTypes = [
    { name: 'Saved Audience', icon: 'ng-fa-icon fad fa-user-friends', value: AudienceType.SAVED_AUDIENCE },
    { name: 'Custom Audience', icon: 'ng-fa-icon fad fa-user-clock', value: AudienceType.CUSTOM_AUDIENCE },
    { name: 'Lookalike Audience', icon: 'ng-fa-icon fad fa-people-arrows', value: AudienceType.LOOKALIKE_AUDIENCE },
  ];
  public audienceSubTypes = [
    { name: 'Website', icon: 'ng-fa-icon fad fa-globe', value: AudienceSubType.WEBSITE },
    { name: 'List', icon: 'ng-fa-icon fad fa-list-alt', value: AudienceSubType.LIST },
  ];

  private subSink = new SubSink();

  ngOnInit(): void {
    this.subSink.sink = this.audienceForm
      .get('provider')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((provider) => {
        this.adAccountList = this.getAdAccountsForProvider(provider);
        this.audienceForm.get('adAccount').setValue(null);
        this.setAudienceTypeToNullIfLookalikeTypeIsAlreadySelectedAndSwitchToLinkedin(provider);
        this.setAudienceSubTypeToNullIfListIsAlreadySelectedAndSwitchToLinkedin(provider);
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public getAdAccountsForProvider(provider: string): NzSelectOptionInterface[] {
    return getAdAccountsByProviderWholeObj(this.adNetworks, provider);
  }

  private setAudienceTypeToNullIfLookalikeTypeIsAlreadySelectedAndSwitchToLinkedin(provider: SupportedProviders) {
    const audienceType = this.audienceForm.get('audienceType');
    if (audienceType.value === AudienceType.LOOKALIKE_AUDIENCE && provider === SupportedProviders.LINKEDIN) {
      audienceType.setValue(null);
    }
  }

  private setAudienceSubTypeToNullIfListIsAlreadySelectedAndSwitchToLinkedin(provider: SupportedProviders) {
    const audienceType = this.audienceForm.get('audienceSubType');
    if (audienceType.value === AudienceSubType.LIST && provider === SupportedProviders.LINKEDIN) {
      audienceType.setValue(null);
    }
  }
}
