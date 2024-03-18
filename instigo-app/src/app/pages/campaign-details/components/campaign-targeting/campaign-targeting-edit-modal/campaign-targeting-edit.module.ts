import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SavedAudienceTargetingModuleImpl } from '@app/features/audience-creation/modules/saved-audience/saved-audience-targeting/saved-audience-targeting.module';
import { CampaignTargetingEditComponent } from '@app/pages/campaign-details/components/campaign-targeting/campaign-targeting-edit-modal/campaign-targeting-edit.component';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [CampaignTargetingEditComponent],
  imports: [
    CommonModule,
    SavedAudienceTargetingModuleImpl,
    UiSharedModule,
    NzFormModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
  ],
  exports: [CampaignTargetingEditComponent],
})
export class CampaignTargetingEditModule {}
