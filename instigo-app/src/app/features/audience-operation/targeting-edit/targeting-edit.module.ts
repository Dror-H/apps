import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SavedAudienceTargetingModuleImpl } from '@app/features/audience-creation/modules/saved-audience/saved-audience-targeting/saved-audience-targeting.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TargetingEditComponent } from './targeting-edit.component';
import { TargetingModalTriggerComponent } from './targeting-modal-trigger.component';

@NgModule({
  declarations: [TargetingEditComponent, TargetingModalTriggerComponent],
  imports: [
    CommonModule,
    SavedAudienceTargetingModuleImpl,
    UiSharedModule,
    NzButtonModule,
    NzModalModule,
    NzGridModule,
    NzCardModule,
  ],
  exports: [TargetingEditComponent],
})
export class TargetingEditModule {}
