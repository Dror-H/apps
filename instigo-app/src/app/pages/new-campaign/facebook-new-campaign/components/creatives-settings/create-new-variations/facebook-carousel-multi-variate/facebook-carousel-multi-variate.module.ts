import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { FacebookCarouselMultiVariateComponent } from './facebook-carousel-multi-variate.component';
import { MediaImageUppyModule } from '@app/shared/ad-template/media/media-image-uppy/media-image-uppy.module';

@NgModule({
  declarations: [FacebookCarouselMultiVariateComponent],
  exports: [FacebookCarouselMultiVariateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    UiSharedModule,
    UiFacebookModule,
    MediaImageUppyModule,
    NzFormModule,
    NzButtonModule,
    NzSwitchModule,
    NzTabsModule,
    NzPopconfirmModule,
  ],
})
export class FacebookCarouselMultiVariateModule {}
