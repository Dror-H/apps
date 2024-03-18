import { NgModule } from '@angular/core';
import { LinkedinTargetingSettingsComponent } from './linkedin-targeting-settings.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LinkedinLanguageSelectorModule } from './langauge-selector/linkedin-language-selector.module';
import { CommonModule } from '@angular/common';
import { UiLinkedinModule } from '@instigo-app/ui/linkedin';
import { LinkedinSavedAudienceTargetingModule } from '@app/features/audience-creation/modules/saved-audience/saved-audience-targeting/linkedin-saved-audience-targeting/linkedin-saved-audience-targeting.module';

@NgModule({
  declarations: [LinkedinTargetingSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LinkedinLanguageSelectorModule,
    LinkedinSavedAudienceTargetingModule,
    UiLinkedinModule,
    NzCardModule,
    NzFormModule,
    NzDividerModule,
    NzButtonModule,
  ],
  exports: [LinkedinTargetingSettingsComponent],
})
export class LinkedinTargetingSettingsModule {}
