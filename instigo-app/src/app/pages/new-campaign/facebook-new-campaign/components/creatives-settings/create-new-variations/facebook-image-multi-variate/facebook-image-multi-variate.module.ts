import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FacebookImageMultiVariateComponent } from './facebook-image-multi-variate.component';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { MediaImageUppyModule } from '@app/shared/ad-template/media/media-image-uppy/media-image-uppy.module';

@NgModule({
  declarations: [FacebookImageMultiVariateComponent],
  exports: [FacebookImageMultiVariateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiSharedModule,
    UiFacebookModule,
    MediaImageUppyModule,
    NzToolTipModule,
    NzFormModule,
    NzButtonModule,
  ],
})
export class FacebookImageMultiVariateModule {}
