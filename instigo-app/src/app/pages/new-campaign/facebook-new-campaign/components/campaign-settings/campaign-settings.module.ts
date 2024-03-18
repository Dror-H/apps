import { NgModule } from '@angular/core';
import { NCCampaignSettingsComponent } from './campaign-settings.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CommonModule } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [NCCampaignSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiSharedModule,
    NzCardModule,
    NzGridModule,
    NzFormModule,
    NzSelectModule,
    NzRadioModule,
    NzSwitchModule,
    NzDividerModule,
    NzButtonModule,
    NzInputModule,
    NzToolTipModule,
  ],
  exports: [NCCampaignSettingsComponent],
})
export class CampaignSettingsModule {}
