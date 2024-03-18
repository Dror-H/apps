import { TestBed } from '@angular/core/testing';
import { AuthState } from '@audience-app/store/auth.state';
import { EmitterService } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';

describe('AuthState', () => {
  let store: Store;
  let emitter: EmitterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestBedModule.configureTestingModule([AuthState])],
    });

    store = TestBed.inject(Store);
    emitter = TestBed.inject(EmitterService);
  });

  it('should add token to state', () => {
    const token = '123456';
    emitter.action<string>(AuthState.set).emit(token);
    const searchHistory = store.selectSnapshot<string[]>((state) => state.auth.token);
    expect(searchHistory).toEqual(token);
  });

  it('should get token from state', () => {
    expect(AuthState.get({ token: 'test' })).toBe('test');
  });
});
