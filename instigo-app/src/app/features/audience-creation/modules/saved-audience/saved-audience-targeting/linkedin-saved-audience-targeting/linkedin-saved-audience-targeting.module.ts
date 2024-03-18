import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomAudienceContainerModule } from '@app/features/audience-creation/components/custom-audience-container/custom-audience-container.module';
import { LinkedinTargetingSelectorModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/targeting-settings/linkedin-targeting-selector/linkedin-targeting-selector.module';
import { UiLinkedinModule } from '@instigo-app/ui/linkedin';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { LinkedinSavedAudienceTargetingComponent } from './linkedin-saved-audience-targeting.component';

@NgModule({
  declarations: [LinkedinSavedAudienceTargetingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LinkedinTargetingSelectorModule,
    CustomAudienceContainerModule,
    UiLinkedinModule,
    UiSharedModule,
    NzDividerModule,
    NzFormModule,
  ],
  exports: [LinkedinSavedAudienceTargetingComponent],
})
export class LinkedinSavedAudienceTargetingModule {}
