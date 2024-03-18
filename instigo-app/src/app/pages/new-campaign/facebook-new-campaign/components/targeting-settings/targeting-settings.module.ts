import { NgModule } from '@angular/core';
import { NCTargetingSettingsComponent } from './targeting-settings.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { LoadSavedAudienceModule } from './define-audience/load-saved-audience/load-saved-audience.module';
import { CreateSavedAudienceModule } from './define-audience/create-saved-audience/create-saved-audience.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { TargetingTypeSelectorModule } from './targeting-type-selector/targeting-type-selector.module';

@NgModule({
  declarations: [NCTargetingSettingsComponent],
  exports: [NCTargetingSettingsComponent],
  imports: [
    CommonModule,
    LoadSavedAudienceModule,
    CreateSavedAudienceModule,
    TargetingTypeSelectorModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzBadgeModule,
    NzDividerModule,
    NzToolTipModule,
    NzFormModule,
  ],
})
export class TargetingSettingsModule {}
