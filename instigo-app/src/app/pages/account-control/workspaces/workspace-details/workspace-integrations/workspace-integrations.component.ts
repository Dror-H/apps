import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { AdAccountSelectComponent } from '@app/features/ad-account-select/ad-account-select.component';
import { providerColors, providerIcons } from '@app/global/constants';
import { UserState } from '@app/global/user.state';
import {
  AdAccountDTO,
  encodeState,
  Loading,
  SupportedProviders,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-workspace-integrations',
  templateUrl: './workspace-integrations.component.html',
  styleUrls: ['./workspace-integrations.component.scss'],
})
export class WorkspaceIntegrationsComponent implements OnInit, OnDestroy {
  @Input()
  workspace: WorkspaceDTO;

  @Output()
  workspaceUpdated = new EventEmitter<any>();

  @ViewChild('modalCloseIcon', { static: true })
  modalCloseIcon!: TemplateRef<void>;

  @ViewChild('connectAdAccountHeaderTemplate', { static: true })
  connectAdAccountHeaderTemplate!: TemplateRef<any>;

  @Emitter(UserState.set) setUser: Emittable<string>;
  public providers: { label: string; value: string; icon: string; color: string; available: boolean }[];
  public enableLinkedin: boolean;

  private subscription = new SubSink();

  constructor(
    private modalService: NzModalService,
    private store: Store,
    private readonly adAccountApiService: AdAccountApiService,
  ) {
    this.enableLinkedin = environment.features.linkedin;
  }

  get workspaceTokens(): { id: string; createdAt: string; provider: string; scope: string; status: string }[] {
    return this.workspace?.owner?.oAuthTokens;
  }

  ngOnInit(): void {
    this.providers = [
      {
        label: 'Facebook',
        value: 'facebook',
        icon: providerIcons.facebook,
        color: providerColors.facebook,
        available: true,
      },
      {
        label: 'LinkedIn',
        value: 'linkedin',
        icon: providerIcons.linkedin,
        color: providerColors.linkedin,
        available: this.enableLinkedin,
      },
      {
        label: 'Google',
        value: 'google',
        icon: providerIcons.google,
        color: providerColors.google,
        available: false,
      },
      {
        label: 'TikTok',
        value: 'tiktok',
        icon: providerIcons.tiktok,
        color: providerColors.tiktok,
        available: false,
      },
      {
        label: 'Twitter',
        value: 'twitter',
        icon: providerIcons.twitter,
        color: providerColors.twitter,
        available: false,
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public isProviderConnected(providerName: string): boolean {
    return this.workspaceTokens
      .filter(({ scope }) => scope === 'authorizeApp')
      .map(({ provider }) => provider)
      .includes(providerName);
  }

  public isProviderAvailable(providerName: string): boolean {
    const { available } = this.providers.find(({ value }) => value === providerName);
    return available;
  }

  public isProviderActive(provider: string): boolean {
    const token = this.workspaceTokens
      .filter(({ scope }) => scope === 'authorizeApp')
      .find((token) => token.provider === provider);
    return token?.status === 'active';
  }

  public getProviderIcon(providerName: string): string {
    return this.providers.find(({ value }) => value === providerName).icon;
  }

  public getProviderColor(providerName: string): string {
    return this.providers.find(({ value }) => value === providerName).color;
  }

  public getProviderLabel(providerName: string): string {
    return this.providers.find(({ value }) => value === providerName).label;
  }

  public getProviderConnectionStatusIcon(provider: string): string {
    return this.isProviderConnected(provider) ? 'fas fa-share-alt' : 'fas-plus';
  }

  public getProviderAdAccountsStatusIcon(provider: string): string {
    return this.isProviderConnected(provider) ? 'fas fa-unlock' : 'fas fa-lock';
  }

  public isWorkspaceOwner(): boolean {
    return this.workspace.owner.id === this.store.selectSnapshot(UserState.get).id;
  }

  public getProviderConnectionDate(providerName: string): string {
    const { createdAt } = this.getProviderOauthToken(providerName);
    return createdAt;
  }

  public addMoreAdAccount(provider: SupportedProviders): Promise<void> {
    const oAuthToken = this.getProviderOauthToken(provider);

    if (!oAuthToken) {
      this.loginOnProviderPlatform(provider);
      return;
    }

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
      if (selectedAdAccounts instanceof HttpErrorResponse && selectedAdAccounts.status === 401) {
        this.loginOnProviderPlatform(provider);
      }

      if (selectedAdAccounts && typeof selectedAdAccounts[Symbol.iterator] === 'function') {
        this.createAdAccounts(selectedAdAccounts);
      }
    });
  }

  public loginOnProviderPlatform(providerName: string): void {
    this.store.dispatch(new Loading({ loading: true }));
    window.location.href = this.getSocialLoginUrl(providerName);
    this.store.dispatch(new Loading({ loading: false }));
  }

  private getProviderOauthToken(providerName: string): {
    id: string;
    createdAt: string;
    provider: string;
    scope: string;
    status: string;
  } {
    return this.workspaceTokens.find(({ provider, scope }) => provider === providerName && scope === 'authorizeApp');
  }

  private getSocialLoginUrl(provider: string): string {
    const { email } = this.store.selectSnapshot(UserState.get);
    const state = {
      user: { email },
      scope: `authorizeApp`,
      redirect: `${environment.frontendUrl}/account-control/workspaces/details/${this.workspace.id}`,
    };

    return `server/auth/${provider}/authorizeApp/login?state=${encodeState(state)}`;
  }

  private updateWorkspace(): void {
    this.workspaceUpdated.emit(this.workspace);
  }

  private createAdAccounts(adAccounts: AdAccountDTO[]): void {
    const adAccountsToCreate = adAccounts.map((account) => ({
      ...account,
      workspace: { id: this.workspace.id } as any,
    }));
    this.adAccountApiService.bulkCreate({ payload: adAccountsToCreate }).subscribe((createdAdAccounts) => {
      this.workspace.adAccounts.push(...createdAdAccounts);
      this.updateWorkspace();
    });
  }
}
