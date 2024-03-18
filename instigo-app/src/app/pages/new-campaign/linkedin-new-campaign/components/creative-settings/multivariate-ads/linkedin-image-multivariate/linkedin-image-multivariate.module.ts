import { NgModule } from '@angular/core';
import { LinkedinImageMultivariateComponent } from './linkedin-image-multivariate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { MediaImageUppyModule } from '@app/shared/ad-template/media/media-image-uppy/media-image-uppy.module';

@NgModule({
  declarations: [LinkedinImageMultivariateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MediaImageUppyModule,
    UiSharedModule,
    NzCardModule,
    NzFormModule,
    NzButtonModule,
    NzDividerModule,
  ],
  exports: [LinkedinImageMultivariateComponent],
})
export class LinkedinImageMultivariateModule {}
