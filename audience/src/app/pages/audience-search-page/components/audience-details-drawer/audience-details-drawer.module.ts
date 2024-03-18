import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceDetailsDrawerComponent } from './audience-details-drawer.component';
import { SharedModule } from '@audience-app/shared/shared.module';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AudienceTargetingTitleModule } from '../audience-targeting-title/audience-targeting-title.module';

@NgModule({
  declarations: [AudienceDetailsDrawerComponent],
  exports: [AudienceDetailsDrawerComponent],
  imports: [
    CommonModule,
    NzDrawerModule,
    NzTypographyModule,
    NzDividerModule,
    AudienceTargetingTitleModule,
    SharedModule,
  ],
})
export class AudienceDetailsDrawerModule {}
