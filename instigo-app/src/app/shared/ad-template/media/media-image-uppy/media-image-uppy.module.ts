import { NgModule } from '@angular/core';
import { MediaImageUppyComponent } from './media-image-uppy.component';
import { UppyAngularDashboardModule } from '@uppy/angular';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CommonModule } from '@angular/common';
import { SelectExistingModule } from '../select-existing/select-existing.module';

@NgModule({
  declarations: [MediaImageUppyComponent],
  imports: [
    CommonModule,
    UppyAngularDashboardModule,
    SelectExistingModule,
    UiSharedModule,
    NzFormModule,
    NzButtonModule,
    NzAlertModule,
  ],
  exports: [MediaImageUppyComponent],
})
export class MediaImageUppyModule {}
