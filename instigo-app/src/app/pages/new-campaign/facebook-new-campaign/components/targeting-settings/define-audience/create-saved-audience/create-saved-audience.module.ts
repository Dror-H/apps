import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SavedAudienceTargetingModuleImpl } from '@app/features/audience-creation/modules/saved-audience/saved-audience-targeting/saved-audience-targeting.module';
import { CreateSavedAudienceComponent } from './create-saved-audience.component';

@NgModule({
  declarations: [CreateSavedAudienceComponent],
  imports: [SavedAudienceTargetingModuleImpl, CommonModule],
  exports: [CreateSavedAudienceComponent],
})
export class CreateSavedAudienceModule {}
