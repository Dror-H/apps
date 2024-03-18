import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SavedAudienceTargetingModuleImpl } from './saved-audience-targeting/saved-audience-targeting.module';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, SavedAudienceTargetingModuleImpl],
})
export class SavedAudienceTargetingModule {}
