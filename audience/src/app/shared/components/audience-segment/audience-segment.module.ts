import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceSegmentComponent } from './audience-segment.component';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { SharedPipesModule } from '@audience-app/shared/pipes/shared-pipes.module';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [AudienceSegmentComponent],
  imports: [
    CommonModule,
    UiSharedModule,
    NzTypographyModule,
    NzDividerModule,
    NzTagModule,
    NzGridModule,
    SharedPipesModule,
  ],
  exports: [AudienceSegmentComponent],
})
export class AudienceSegmentModule {}
