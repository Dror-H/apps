import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { getHours, getTime } from 'date-fns';
import { isNull } from 'lodash-es';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserApiService } from '../api/services/user.api.service';

export class GetIpGeolocation {
  static readonly type = '[User] GET_IP_GEOLOCATION';
}
export class UpdateUser {
  static readonly type = '[User] UPDATE';
  constructor(public user: Partial<User>) {}
}

export interface UserStateModel {
  user: User;
  geolocation: any;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    user: {},
    geolocation: null,
  },
})
@Injectable()
export class UserState {
  constructor(private userService: UserApiService, private http: HttpClient) {}

  @Receiver()
  public static set({ patchState }: StateContext<UserStateModel>, { payload }: EmitterAction<Partial<any>>) {
    const user = { ...payload };
    patchState({ user });
  }

  @Receiver()
  public static update(
    { patchState }: StateContext<UserStateModel>,
    { payload }: EmitterAction<Partial<UserStateModel>>,
  ) {
    patchState({ user: payload });
  }

  @Selector()
  public static get(state: UserStateModel): User {
    return state.user;
  }

  @Selector()
  public static assignedWorkspaces(state: UserStateModel): WorkspaceDTO[] {
    return state.user.assignedWorkspaces;
  }

  @Selector()
  public static geolocation(state: UserStateModel): User {
    return state.geolocation;
  }

  @Selector()
  public static isSubscriptionActive(state: UserStateModel): boolean {
    return state.user?.subscriptionStatus;
  }

  @Selector()
  public static layoutSettings(state: UserStateModel) {
    return {
      headerStyle: state.user.settings.headerStyle,
      sidebarStyle: state.user.settings.sidebarStyle,
    };
  }

  @Selector()
  public static greeting(state: UserStateModel): string {
    const time = getHours(getTime(new Date()));
    if (time < 12) return `Good Morning, ${state.user.firstName}`;
    if (time < 18) return `Good Afternoon, ${state.user.firstName}`;
    if (time < 24) return `Good Evening, ${state.user.firstName}`;
    return 'Welcome';
  }

  @Action(UpdateUser)
  updateUserAction({ patchState }: StateContext<Partial<UserState>>, { user }: UpdateUser): Observable<any> {
    return this.userService.updateMe({ payload: user }).pipe(
      tap((response: any) => {
        const user = { ...response };
        patchState({ user } as any);
      }),
      catchError((err: HttpErrorResponse) => throwError(new Error(err.message))),
    );
  }

  @Action(GetIpGeolocation)
  getUserIpGeolocationAction({ patchState }: StateContext<any>): Observable<any> {
    return this.getIPAddress().pipe(
      switchMap((response: any) => {
        if (isNull(response)) {
          return throwError(new Error('IP address undefined'));
        }
        return this.getIPGeolocation(response.ip);
      }),
      tap((response: any) => {
        patchState({ geolocation: response });
      }),
      catchError((err: Error) => {
        console.error(err.message);
        return of(null);
      }),
    );
  }

  getGeoLocation(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position);
        });
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  getIPAddress(): Observable<unknown> {
    return this.http.get('https://api.ipify.org/?format=json');
  }

  getIPGeolocation(ip): Observable<unknown> {
    return this.http.get(`https://ipapi.co/${ip}/json/`);
  }
}
