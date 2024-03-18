import { NgModule } from '@angular/core';
import { LinkedinCampaignSettingsComponent } from './linkedin-campaign-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { CampaignGroupsSelectorModule } from './campaign-groups/campaign-groups-selector.module';

@NgModule({
  declarations: [LinkedinCampaignSettingsComponent],
  imports: [
    CommonModule,
    CampaignGroupsSelectorModule,
    ReactiveFormsModule,
    UiSharedModule,
    NzFormModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
  ],
  exports: [LinkedinCampaignSettingsComponent],
})
export class LinkedinCampaignSettingsModule {}
