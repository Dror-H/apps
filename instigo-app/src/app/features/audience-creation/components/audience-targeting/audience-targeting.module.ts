import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CustomAudienceModule } from '../../modules/custom-audience/custom-audience.module';
import { LookalikeAudienceModule } from '../../modules/lookalike-audience/lookalike-audience.module';
import { SavedAudienceTargetingModuleImpl } from '../../modules/saved-audience/saved-audience-targeting/saved-audience-targeting.module';
import { AudienceTargetingComponent } from './audience-targeting.component';

@NgModule({
  declarations: [AudienceTargetingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomAudienceModule,
    SavedAudienceTargetingModuleImpl,
    LookalikeAudienceModule,
    NzCardModule,
    NzGridModule,
    NzButtonModule,
    NzDividerModule,
    NzModalModule,
  ],
  exports: [AudienceTargetingComponent],
})
export class AudienceTargetingModule {}
