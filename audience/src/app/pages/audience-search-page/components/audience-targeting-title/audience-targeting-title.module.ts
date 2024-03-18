import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceTargetingTitleComponent } from './audience-targeting-title.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [AudienceTargetingTitleComponent],
  imports: [CommonModule, NzDividerModule, NzTypographyModule],
  exports: [AudienceTargetingTitleComponent],
})
export class AudienceTargetingTitleModule {}
