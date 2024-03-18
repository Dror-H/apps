import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SavedAudienceTargetingModuleImpl } from '@app/features/audience-creation/modules/saved-audience/saved-audience-targeting/saved-audience-targeting.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { LoadSavedAudienceComponent } from './load-saved-audience.component';
import { SavedAudienceSelectorModule } from './saved-audience-selector/saved-audience-selector.module';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [LoadSavedAudienceComponent],
  exports: [LoadSavedAudienceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SavedAudienceSelectorModule,
    SavedAudienceTargetingModuleImpl,
    NzSelectModule,
    NzToolTipModule,
    NzCardModule,
    NzFormModule,
    NzSliderModule,
    NzDividerModule,
    NzButtonModule,
    NzRadioModule,
  ],
})
export class LoadSavedAudienceModule {}
