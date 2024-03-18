import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FacebookSavedAudienceTargetingComponent } from './facebook-saved-audience-targeting.component';

@NgModule({
  declarations: [FacebookSavedAudienceTargetingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFacebookModule,
    NzGridModule,
    NzRadioModule,
    NzInputModule,
    NzSelectModule,
    NzToolTipModule,
    NzSwitchModule,
    NzFormModule,
    NzListModule,
    NzCardModule,
    NzDividerModule,
    NzAlertModule,
    NzButtonModule,
    UiSharedModule,
  ],
  exports: [FacebookSavedAudienceTargetingComponent],
})
export class FacebookSavedAudienceTargetingModule {}
