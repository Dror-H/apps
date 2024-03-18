import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { AdAccountDTO, PromotePage, SupportedProviders } from '@instigo-app/data-transfer-object';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { remove } from 'lodash-es';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-facebook-connections',
  templateUrl: './facebook-connections.component.html',
  styleUrls: ['./facebook-connections.component.scss'],
})
export class FacebookConnectionsComponent implements OnInit {
  @Input() savedAudienceForm: FormGroup;
  @Input() adAccount: AdAccountDTO;

  public hasConnections = false;
  public promotePages: PromotePage[];
  public connectedPromotePages: PromotePage[];
  public excludedPromotePages: PromotePage[];
  public connectionForm: FormGroup;

  private existingConnectionsValue: { connected: string[]; friendsConnected: string[]; excluded: string[] } = {
    connected: [],
    friendsConnected: [],
    excluded: [],
  };
  private subSink = new SubSink();

  @SelectSnapshot(WorkspaceState.adAccountsFormList) private adNetworks: any;

  constructor(private fb: FormBuilder) {
    this.initConnectionForm();
  }

  @Input()
  public set existingConnections(connections) {
    if (connections && (connections?.connected || connections?.friendsConnected || connections?.excluded)) {
      this.existingConnectionsValue = connections;
      this.toggleConnections(true);
    }
  }

  public get connected(): FormControl {
    return this.connectionForm.get('connected') as FormControl;
  }

  public get friendsConnected(): FormControl {
    return this.connectionForm.get('friendsConnected') as FormControl;
  }

  public get excluded(): FormControl {
    return this.connectionForm.get('excluded') as FormControl;
  }

  public toggleConnections($event: boolean) {
    this.hasConnections = $event;
    if ($event === false) {
      this.initConnectionForm();
      this.savedAudienceForm.controls.facebookConnections.setValue([]);
    } else {
      this.setExtraAddAccounts();
      this.setExistingConnections(this.existingConnectionsValue);
    }
  }

  ngOnInit(): void {
    this.subSink.sink = this.connectionForm.valueChanges.subscribe((change) => {
      change.connected = change.connected.map((item) => item.id).filter((item) => item != '');
      change.friendsConnected = change.friendsConnected.map((item) => item.id).filter((item) => item != '');
      change.excluded = change.excluded.map((item) => item.id).filter((item) => item != '');
      this.savedAudienceForm.controls.facebookConnections.setValue(change);
    });
  }

  public onAddConnected(promotePage: PromotePage) {
    const pageListOfConnected = [...this.connected.value, promotePage];
    this.connected.setValue(pageListOfConnected);
    this.connectedPromotePages = this.removeSelectedPage(this.connectedPromotePages, promotePage);
    this.syncComplementaryForms(this.excluded, promotePage, this.excludedPromotePages);
  }

  public onAddFriendsConnected(promotePage: PromotePage) {
    const pageListOfConnected = [...this.friendsConnected.value, promotePage];
    this.friendsConnected.setValue(pageListOfConnected);
    this.promotePages = this.removeSelectedPage(this.promotePages, promotePage);
  }

  public onAddExcluded(promotePage: PromotePage) {
    const pageListOfConnected = [...this.excluded.value, promotePage];
    this.excluded.setValue(pageListOfConnected);
    this.excludedPromotePages = this.removeSelectedPage(this.excludedPromotePages, promotePage);
    this.syncComplementaryForms(this.connected, promotePage, this.connectedPromotePages);
  }

  public onRemovePageFromConnected(promotePage: PromotePage, index: number) {
    this.connected.value.splice(index, 1);
    this.connected.setValue(this.connected.value);
    this.connectedPromotePages = this.addRemovedPage(this.connectedPromotePages, promotePage);
  }

  public onRemovePageFromFriendsConnected(promotePage: PromotePage, index: number) {
    this.friendsConnected.value.splice(index, 1);
    this.friendsConnected.setValue(this.friendsConnected.value);
    this.promotePages = this.addRemovedPage(this.promotePages, promotePage);
  }

  public onRemovePageFromExcluded(promotePage: PromotePage, index: number) {
    this.excluded.value.splice(index, 1);
    this.excluded.setValue(this.excluded.value);
    this.excludedPromotePages = this.addRemovedPage(this.excludedPromotePages, promotePage);
  }

  private removeSelectedPage(promotedPages: PromotePage[], promotePage: PromotePage): PromotePage[] {
    const aux = [...promotedPages];
    remove(aux, (page: PromotePage) => page.id === promotePage.id);
    return aux;
  }

  private addRemovedPage(promotedPages: PromotePage[], promotePage: PromotePage): PromotePage[] {
    return [...promotedPages, promotePage];
  }

  private syncComplementaryForms(
    formToRemoveFrom: FormControl,
    promotePage: PromotePage,
    complementaryPromotePages: PromotePage[],
  ) {
    if (formToRemoveFrom.value.find((page) => page.id === promotePage.id)) {
      this.removePageFromComplementaryFormControl(formToRemoveFrom, promotePage);
      complementaryPromotePages.push(promotePage);
    }
  }

  private removePageFromComplementaryFormControl(formToRemoveFrom: FormControl, promotePage: PromotePage) {
    const aux = [...formToRemoveFrom.value];
    remove(aux, (page: PromotePage) => page.id === promotePage.id);
    formToRemoveFrom.setValue(aux);
  }

  private setExtraAddAccounts(): void {
    const adAccountId = this.adAccount.id;
    if (adAccountId) {
      this.promotePages =
        this.connectedPromotePages =
        this.excludedPromotePages =
          this.getExtraAccountsFromProviderById(adAccountId)?.promotePage;
    }
  }

  private getExtraAccountsFromProviderById(id: string) {
    // TODO: if we'll use this component adapt this component to use pages instead of extraAccounts
    return this.adNetworks
      .filter((network) => network.value === SupportedProviders.FACEBOOK)[0]
      .adAccounts.filter((adAccount) => adAccount.id === id)[0].extraAccounts;
  }

  private setExistingConnections(existingConnections: {
    connected: string[];
    friendsConnected: string[];
    excluded: string[];
  }) {
    if (existingConnections && this.promotePages) {
      existingConnections.connected.forEach((id) =>
        this.onAddConnected(this.connectedPromotePages.find((page) => page.id === id)),
      );
      existingConnections.friendsConnected.forEach((id) =>
        this.onAddFriendsConnected(this.promotePages.find((page) => page.id === id)),
      );
      existingConnections.excluded.forEach((id) =>
        this.onAddExcluded(this.excludedPromotePages.find((page) => page.id === id)),
      );
    }
  }

  private initConnectionForm() {
    this.connectionForm = this.fb.group({
      connected: [[]],
      friendsConnected: [[]],
      excluded: [[]],
    });
  }
}
