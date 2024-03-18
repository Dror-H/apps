import { environment } from 'src/environments/environment';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AUDIENCES_API_SERVICE,
  ENVIRONMENT,
  STORE,
  TARGETING_API_SERVICE,
  UiSharedModule,
} from '@instigo-app/ui/shared';
import { FacebookSavedAudienceTargetingModule } from './facebook-saved-audience-targeting/facebook-saved-audience-targeting.module';
import { LinkedinSavedAudienceTargetingModule } from './linkedin-saved-audience-targeting/linkedin-saved-audience-targeting.module';
import { SavedAudienceTargetingComponent } from './saved-audience-targeting.component';
import { Store } from '@ngxs/store';
import { TargetingApiService } from '@app/api/services/target-template.api.service';
import { AudienceApiService } from '@app/api/services/audience.api.service';

@NgModule({
  declarations: [SavedAudienceTargetingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FacebookSavedAudienceTargetingModule,
    LinkedinSavedAudienceTargetingModule,
    UiSharedModule,
    UiFacebookModule,
  ],
  exports: [SavedAudienceTargetingComponent],
  providers: [
    { provide: STORE, useExisting: Store },
    { provide: TARGETING_API_SERVICE, useExisting: TargetingApiService },
    { provide: AUDIENCES_API_SERVICE, useExisting: AudienceApiService },
    { provide: ENVIRONMENT, useValue: environment },
  ],
})
export class SavedAudienceTargetingModuleImpl {}
