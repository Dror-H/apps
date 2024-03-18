import { NgModule } from '@angular/core';
import { CustomAudienceContainerComponent } from './custom-audience-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { CustomAudienceSelectorModule } from './custom-audience-selector/custom-audience-selector.module';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [CustomAudienceContainerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzToolTipModule,
    NzButtonModule,
    NzFormModule,
    NzGridModule,
    UiSharedModule,
    CustomAudienceSelectorModule,
  ],
  exports: [CustomAudienceContainerComponent],
})
export class CustomAudienceContainerModule {}
