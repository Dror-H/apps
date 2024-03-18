import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceDetailsOverviewComponent } from '@audience-app/shared/components/audience-details-overview/audience-details-overview.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SharedPipesModule } from '@audience-app/shared/pipes/shared-pipes.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [AudienceDetailsOverviewComponent],
  exports: [AudienceDetailsOverviewComponent],
  imports: [
    CommonModule,
    NzGridModule,
    NzTagModule,
    NzDividerModule,
    NzTypographyModule,
    SharedPipesModule,
    UiSharedModule,
  ],
})
export class AudienceDetailsOverviewModule {}
