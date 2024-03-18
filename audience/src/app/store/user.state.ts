import { Injectable } from '@angular/core';
import { User } from '@audience-app/global/models/app.models';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';
import { Selector, State, StateContext } from '@ngxs/store';

@State<User | null>({ name: 'user', defaults: null })
@Injectable()
export class UserState {
  @Receiver()
  static updateUserAndAdAccounts({ setState }: StateContext<User>, { payload }: EmitterAction<User>): void {
    setState(payload);
  }

  @Receiver()
  static logout({ setState }: StateContext<User>): void {
    setState(null);
  }

  @Selector()
  static getUserAndAdAccounts(state: User): User {
    return state;
  }
}
