import { TestBed } from '@angular/core/testing';
import { LoadingState } from '@audience-app/store/loading.state';
import { EmitterService } from '@ngxs-labs/emitter';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { Store } from '@ngxs/store';

describe('LoadingState', () => {
  let store: Store;
  let emitter: EmitterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestBedModule.configureTestingModule([LoadingState])],
    });
    store = TestBed.inject(Store);
    emitter = TestBed.inject(EmitterService);
    store.reset(LoadingState);
  });

  it('should return isLoadingAudiences (true)', () => {
    emitter.action<boolean>(LoadingState.setIsLoadingAudiences).emit(true);
    const isLoading = store.selectSnapshot(LoadingState.getIsLoadingAudiences);
    expect(isLoading).toBe(true);
  });

  it('should return isLoadingMergedAudiences (true)', () => {
    emitter.action<boolean>(LoadingState.setIsLoadingMergedAudience).emit(true);
    const isLoading = store.selectSnapshot(LoadingState.getIsLoadingMergedAudience);
    expect(isLoading).toBe(true);
  });

  it('should return isLoadingStatic (true)', () => {
    emitter.action<boolean>(LoadingState.setIsLoadingStatic).emit(true);
    const isLoading = store.selectSnapshot(LoadingState.getIsLoadingStatic);
    expect(isLoading).toBe(true);
  });

  it('should return isSavingAudience (true)', () => {
    emitter.action<boolean>(LoadingState.setIsSavingAudience).emit(true);
    const isLoading = store.selectSnapshot(LoadingState.getIsSavingAudience);
    expect(isLoading).toBe(true);
  });

  it('should return isLoadingKeywordsSuggestions (true)', () => {
    emitter.action<boolean>(LoadingState.setIsLoadingKeywordsSuggestions).emit(true);
    const isLoading = store.selectSnapshot(LoadingState.getIsLoadingKeywordsSuggestions);
    expect(isLoading).toBe(true);
  });
});
