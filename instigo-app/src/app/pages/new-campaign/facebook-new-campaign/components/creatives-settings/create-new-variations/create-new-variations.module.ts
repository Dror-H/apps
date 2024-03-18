import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdTemplateServiceModule } from '@app/features/ad-template-operation/services/ad-template-service.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AdPreviewCarouselContainerModule } from './ad-preview-carousel/ad-preview-carousel-container.module';
import { CreateNewVariationsComponent } from './create-new-variations.component';
import { FacebookCarouselMultiVariateModule } from './facebook-carousel-multi-variate/facebook-carousel-multi-variate.module';
import { FacebookImageMultiVariateModule } from './facebook-image-multi-variate/facebook-image-multi-variate.module';
import { FacebookVideoMultiVariateModule } from './facebook-video-multi-variate/facebook-video-multi-variate.module';

@NgModule({
  declarations: [CreateNewVariationsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdTemplateServiceModule,
    AdPreviewCarouselContainerModule,
    FacebookImageMultiVariateModule,
    FacebookVideoMultiVariateModule,
    FacebookCarouselMultiVariateModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzToolTipModule,
    NzSelectModule,
    UiSharedModule,
    NzDividerModule,
    NzButtonModule,
  ],
  exports: [CreateNewVariationsComponent],
})
export class CreateNewVariationsModule {}
