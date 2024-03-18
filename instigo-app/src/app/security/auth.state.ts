import { Injectable } from '@angular/core';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Selector, State, StateContext } from '@ngxs/store';

interface AuthStateModel {
  token: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: '',
  },
})
@Injectable()
export class AuthState {
  @Receiver()
  public static set({ setState }: StateContext<AuthStateModel>, { payload }: EmitterAction<string>) {
    setState({ token: payload });
  }

  @Selector()
  public static get(state: AuthStateModel): string {
    return state.token;
  }
}
