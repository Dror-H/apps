import { Injectable } from '@angular/core';
import { LoadingState } from '@audience-app/store/loading.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  @Emitter(LoadingState.setIsLoadingAudiences) isLoadingAudiences: Emittable<boolean>;
  @Emitter(LoadingState.setIsLoadingMergedAudience) isLoadingMergedAudience: Emittable<boolean>;
  @Emitter(LoadingState.setIsLoadingStatic) isLoadingStatic: Emittable<boolean>;
  @Emitter(LoadingState.setIsSavingAudience) isSavingAudience: Emittable<boolean>;
  @Emitter(LoadingState.setIsLoadingKeywordsSuggestions) isLoadingKeywordsSuggestions: Emittable<boolean>;
}
