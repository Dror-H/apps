import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudienceCardComponent } from '@audience-app/pages/audience-search-page/components/audience-card/audience-card.component';
import { SharedModule } from '@audience-app/shared/shared.module';
import { UiComponentsModule } from '@instigo-app/ui/components';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [AudienceCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzRateModule,
    NzDividerModule,
    NzTagModule,
    NzGridModule,
    NzDrawerModule,
    NzTypographyModule,
    SharedModule,
    UiComponentsModule,
    UiSharedModule,
  ],
  exports: [AudienceCardComponent],
})
export class AudienceCardModule {}
