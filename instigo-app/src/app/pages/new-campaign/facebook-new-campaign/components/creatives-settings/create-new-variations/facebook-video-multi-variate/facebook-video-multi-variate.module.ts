import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FacebookVideoMultiVariateComponent } from './facebook-video-multi-variate.component';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { MediaImageUppyModule } from '@app/shared/ad-template/media/media-image-uppy/media-image-uppy.module';
import { MediaVideoUppyModule } from '@app/shared/ad-template/media/media-video-uppy/media-video-uppy.module';

@NgModule({
  declarations: [FacebookVideoMultiVariateComponent],
  exports: [FacebookVideoMultiVariateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiSharedModule,
    UiFacebookModule,
    MediaImageUppyModule,
    MediaVideoUppyModule,
    NzGridModule,
    NzToolTipModule,
    NzFormModule,
    NzButtonModule,
  ],
})
export class FacebookVideoMultiVariateModule {}
