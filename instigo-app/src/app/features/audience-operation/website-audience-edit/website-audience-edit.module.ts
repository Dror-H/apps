import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SavedAudienceTargetingModuleImpl } from '@app/features/audience-creation/modules/saved-audience/saved-audience-targeting/saved-audience-targeting.module';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WebsiteAudienceEditComponent } from './website-audience-edit.component';
import { WebsiteAudienceModalTriggerComponent } from './website-audience-modal-trigger.component';

@NgModule({
  declarations: [WebsiteAudienceModalTriggerComponent, WebsiteAudienceEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SavedAudienceTargetingModuleImpl,
    UiFacebookModule,
    UiSharedModule,
    NzButtonModule,
    NzModalModule,
    NzGridModule,
    NzCardModule,
  ],
  exports: [WebsiteAudienceEditComponent],
})
export class WebsiteAudienceEditModule {}
