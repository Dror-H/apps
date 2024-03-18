import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthApiService } from '@audience-app/api/auth-api/auth-api.service';

import { AuthService } from './auth.service';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@audience-app/store/user.state';

describe('AuthService', () => {
  let service: AuthService;
  let authApi: AuthApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserState]), NgxsEmitPluginModule.forRoot()],
      providers: [
        AuthService,
        {
          provide: AuthApiService,
          useValue: {
            facebookLogin: (): void => {},
            logout: (): void => {},
            me: (): void => {},
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
    authApi = TestBed.inject(AuthApiService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should login', () => {
    const spy = jest.spyOn(authApi, 'facebookLogin');

    service.login();
    expect((service as any)._isLoading$.value).toEqual(true);

    expect(spy).toHaveBeenCalled();
  });

  it('should call _isLoading$.next with false after 10s', fakeAsync(() => {
    const spy = jest.spyOn((service as any)._isLoading$, 'next');
    service.login();
    tick(10000);
    expect(spy).toBeCalledWith(false);
  }));

  it('should logout', () => {
    const spy = jest.spyOn(authApi, 'logout');
    service.logout();

    expect(spy).toHaveBeenCalled();
  });

  it('should get the user info', () => {
    const spy = jest.spyOn(authApi, 'me');
    service.getUserInfo();

    expect(spy).toHaveBeenCalled();
  });
});
