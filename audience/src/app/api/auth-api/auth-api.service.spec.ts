import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthApiService } from '@audience-app/api/auth-api/auth-api.service';
import { AuthState } from '@audience-app/store/auth.state';
import { UserState } from '@audience-app/store/user.state';
import { encodeState } from '@instigo-app/data-transfer-object';
import { EmitterService, NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';

@Component({ selector: '', template: `<div></div>` })
export class MockSearchComponent {}

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpController: HttpTestingController;
  let document: Document;
  let router: Router;
  let store: Store;
  let emitter: EmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockSearchComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'audience-search', component: MockSearchComponent }]),
        StoreTestBedModule.configureTestingModule([UserState, AuthState]),
        NgxsEmitPluginModule.forRoot(),
      ],
      providers: [AuthApiService, { provide: DOCUMENT, useValue: { location: { href: '', reload: jest.fn() } } }],
    });
    service = TestBed.inject(AuthApiService);
    httpController = TestBed.inject(HttpTestingController);
    document = TestBed.inject(DOCUMENT);
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    emitter = TestBed.inject(EmitterService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('facebookLogin', () => {
    it('should redirect to facebook login with state', async () => {
      await router.navigateByUrl('audience-search');
      service.facebookLogin();
      const encodedState = encodeState({ redirect: 'audience-search' });
      expect(document.location.href).toBe(`server/auth/facebook/login?state=${encodedState}`);
    });
  });

  describe('logout', () => {
    it('should emit setToken with value null', () => {
      emitter.action(AuthState.set).emit('test' as any);
      service.logout();
      expect(store.selectSnapshot((state) => state.auth.token)).toBeNull();
    });
    it('should emit setUser with value null', () => {
      emitter.action(UserState.updateUserAndAdAccounts).emit('test' as any);
      service.logout();
      expect(store.selectSnapshot((state) => state.user)).toBeNull();
    });
    it('should call document location reload', () => {
      service.logout();
      expect(document.location.href).toBe('');
    });
  });

  it('should return user info', () => {
    const expectedUser: UserState = {
      name: 'andy',
      email: 'andy@gmail.com',
      emailVerified: true,
      id: 'fasdokfjasdofj',
      profilePicture: 'none',
      adAccounts: [],
    };

    service.me().subscribe((user) => {
      expect(user).toEqual(expectedUser);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `server/me`,
    });

    req.flush(expectedUser);
  });
});
