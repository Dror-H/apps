import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AdAccountApiService } from '@app/api/services/ad-account.api.service';
import { AdAccountSelectModule } from '@app/features/ad-account-select/ad-account-select.module';
import { NgxsModule, Store } from '@ngxs/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { WorkspaceIntegrationsComponent } from './workspace-integrations.component';

const workspaceMock = {
  id: '33dd78d2-16aa-49e1-87c9-ffeea6f95b69',
  createdAt: '2021-05-14T10:43:18.612Z',
  updatedAt: '2021-12-20T12:56:33.130Z',
  version: 8,
  name: 'SandboxWorkspace',
  description: 'SandboxWorkspace',
  disabled: false,
  settings: {
    defaultCurrency: 'USD',
    useCachedInsights: true,
  },
  lastSynced: '2021-12-20T12:56:33.115Z',
  owner: {
    id: '43a86f47-441b-485d-940f-918620f44045',
    username: 'sandbox',
    firstName: 'sandbox',
    lastName: 'sandbox',
    email: 'sandbox@instigo.io',
    phone: null,
    roles: ['USER'],
    pictureUrl: 'https://eu.ui-avatars.com/api/?name=sandbox sandbox',
    oAuthTokens: [
      {
        id: '15c37890-5fcb-41a6-9ddd-6f9c15a39625',
        provider: 'facebook',
        providerClientId: '104861777795471',
        grantedAt: '2021-11-18T13:34:20.044Z',
        expiresAt: null,
        status: 'active',
        scope: 'authorizeApp',
        createdAt: '2021-11-18T13:34:20.044Z',
        updatedAt: '2021-11-18T13:34:20.044Z',
      },
      {
        id: '7b88fa6d-e6cc-4f70-8e6f-a99a06aa25b0',
        provider: 'linkedin',
        providerClientId: 'KO5-Si88Hm',
        grantedAt: '+053928-08-15T01:43:24.000Z',
        expiresAt: '+054092-11-22T01:43:24.000Z',
        status: 'active',
        scope: 'authorizeApp',
        createdAt: '2021-12-16T11:43:49.451Z',
        updatedAt: '2021-12-16T11:54:21.255Z',
      },
    ],
    fullName: 'sandbox sandbox',
  },
};
describe('WorkspaceIntegrationsComponent: ', () => {
  jest.setTimeout(30000);
  let component: WorkspaceIntegrationsComponent;
  let fixture: ComponentFixture<WorkspaceIntegrationsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        CommonModule,
        FormsModule,
        AdAccountSelectModule,
        NzModalModule,
        NzToolTipModule,
        NzButtonModule,
        NzCardModule,
        NzGridModule,
        NzListModule,
      ],
      declarations: [WorkspaceIntegrationsComponent],
      providers: [
        { provide: AdAccountApiService, useValue: {} },
        { provide: NzModalService, useValue: {} },
      ],
    }).compileComponents();
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue('43a86f47-441b-485d-940f-918620f44045');

    fixture = TestBed.createComponent(WorkspaceIntegrationsComponent);
    component = fixture.componentInstance;
    component.workspace = { ...workspaceMock } as any;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should isProviderConnected', () => {
    expect(component.isProviderConnected('facebook')).toBeTruthy();
    expect(component.isProviderConnected('linkedin')).toBeTruthy();
    expect(component.isProviderConnected('twitter')).toBeFalsy();
  });

  it('should isProviderAvailable', () => {
    expect(component.isProviderAvailable('facebook')).toBeTruthy();
    expect(component.isProviderAvailable('linkedin')).toBeTruthy();
    expect(component.isProviderAvailable('twitter')).toBeFalsy();
  });

  it('should getProviderLabel', () => {
    expect(component.getProviderLabel('facebook')).toBe('Facebook');
    expect(component.getProviderLabel('linkedin')).toBe('LinkedIn');
    expect(component.getProviderLabel('twitter')).toBe('Twitter');
  });

  it('should getProviderConnectionStatusIcon', () => {
    expect(component.getProviderConnectionStatusIcon('facebook')).toBe('fas fa-share-alt');
    expect(component.getProviderConnectionStatusIcon('linkedin')).toBe('fas fa-share-alt');
    expect(component.getProviderConnectionStatusIcon('twitter')).toBe('fas-plus');
  });

  it('should getProviderAdAccountsStatusIcon', () => {
    expect(component.getProviderAdAccountsStatusIcon('facebook')).toBe('fas fa-unlock');
    expect(component.getProviderAdAccountsStatusIcon('linkedin')).toBe('fas fa-unlock');
    expect(component.getProviderAdAccountsStatusIcon('twitter')).toBe('fas fa-lock');
  });

  it('should getProviderOauthToken', () => {
    expect((component as any).getProviderOauthToken('facebook')).toBeTruthy();
    expect((component as any).getProviderOauthToken('linkedin')).toBeTruthy();
    expect((component as any).getProviderOauthToken('twitter')).toBeFalsy();
  });

  it('should getSocialLoginUrl', () => {
    store.selectSnapshot = jest.fn().mockReturnValue({ email: 'sandbox@instigo.io' });

    expect((component as any).getSocialLoginUrl('facebook')).toEqual(
      'server/auth/facebook/authorizeApp/login?state=eyJ1c2VyIjp7ImVtYWlsIjoic2FuZGJveEBpbnN0aWdvLmlvIn0sInNjb3BlIjoiYXV0aG9yaXplQXBwIiwicmVkaXJlY3QiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAvYWNjb3VudC1jb250cm9sL3dvcmtzcGFjZXMvZGV0YWlscy8zM2RkNzhkMi0xNmFhLTQ5ZTEtODdjOS1mZmVlYTZmOTViNjkifQ==',
    );
    expect((component as any).getSocialLoginUrl('linkedin')).toEqual(
      'server/auth/linkedin/authorizeApp/login?state=eyJ1c2VyIjp7ImVtYWlsIjoic2FuZGJveEBpbnN0aWdvLmlvIn0sInNjb3BlIjoiYXV0aG9yaXplQXBwIiwicmVkaXJlY3QiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAvYWNjb3VudC1jb250cm9sL3dvcmtzcGFjZXMvZGV0YWlscy8zM2RkNzhkMi0xNmFhLTQ5ZTEtODdjOS1mZmVlYTZmOTViNjkifQ==',
    );
  });
});
