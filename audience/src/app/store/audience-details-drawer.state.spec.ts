import { TestBed } from '@angular/core/testing';
import {
  AudienceDetailsDrawerState,
  AudienceDetailsDrawerStateModel,
} from '@audience-app/store/audience-details-drawer.state';
import { EmitterService } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';

describe('AudienceDetailsDrawerState', () => {
  let store: Store;
  let emitter: EmitterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestBedModule.configureTestingModule([AudienceDetailsDrawerState])],
    });

    store = TestBed.inject(Store);
    emitter = TestBed.inject(EmitterService);
  });

  const mockDrawerData = {
    isVisible: true,
    data: { inclusions: [[]], exclusions: [], userTags: [], specRatio: {}, rank: 0 },
  };
  it('should set drawer state', () => {
    emitter.action<AudienceDetailsDrawerStateModel>(AudienceDetailsDrawerState.set).emit(mockDrawerData);
    const drawerState = store.selectSnapshot<AudienceDetailsDrawerStateModel>(AudienceDetailsDrawerState.get);
    expect(drawerState).toEqual(mockDrawerData);
  });

  it('should get drawer state', () => {
    expect(AudienceDetailsDrawerState.get(mockDrawerData)).toEqual(mockDrawerData);
  });
});
