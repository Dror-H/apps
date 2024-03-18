import { TestBed } from '@angular/core/testing';
import { currentUserMock } from '@audience-app/auth/auth.mocks';
import { User } from '@audience-app/global/models/app.models';
import { UserState } from '@audience-app/store/user.state';
import { EmitterService } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { StateContext, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

const mockStateContext: StateContext<User> = {
  getState(): User {
    return currentUserMock;
  },
  setState(): User {
    return currentUserMock;
  },
  patchState(): User {
    return currentUserMock;
  },
  dispatch(actions: any): Observable<void> {
    return of();
  },
};

describe('UserState', () => {
  let store: Store;
  let emitter: EmitterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestBedModule.configureTestingModule([UserState])],
    });

    store = TestBed.inject(Store);
    emitter = TestBed.inject(EmitterService);
    store.reset(UserState);
  });

  it('should add user to state', () => {
    const user = currentUserMock;
    emitter.action<User>(UserState.updateUserAndAdAccounts).emit(user);
    const storeUser = store.selectSnapshot<string[]>((state) => state.user);
    expect(storeUser).toEqual(user);
  });

  it('should set user state to null', () => {
    emitter.action<void>(UserState.logout).emit();
    const storeUser = store.selectSnapshot<string[]>((state) => state.user);
    expect(storeUser).toBeNull();
  });

  it('should get user data', () => {
    const user = UserState.getUserAndAdAccounts(currentUserMock);
    expect(user).toEqual(currentUserMock);
  });
});
