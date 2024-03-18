import { Injectable } from '@angular/core';
import { AuthApiService } from '@audience-app/api/auth-api/auth-api.service';
import { UserState } from '@audience-app/store/user.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { LoadingState } from '@audience-app/store/loading.state';

@Injectable()
export class AuthService {
  @Emitter(UserState.updateUserAndAdAccounts) updateUser: Emittable<UserState>;
  @Emitter(LoadingState.setIsLoadingAuth) isLoadingAuth: Emittable<boolean>;

  private _isLoading$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading$.asObservable();

  constructor(private authApiService: AuthApiService) {}

  public login(): void {
    this._isLoading$.next(true);
    this.isLoadingAuth.emit(true);
    this.authApiService.facebookLogin();
    setTimeout(() => {
      this._isLoading$.next(false);
      this.isLoadingAuth.emit(false);
    }, 10000);
  }

  public logout(): void {
    this.authApiService.logout();
  }

  public getUserInfo(): Observable<UserState> {
    return this.authApiService.me();
  }
}
