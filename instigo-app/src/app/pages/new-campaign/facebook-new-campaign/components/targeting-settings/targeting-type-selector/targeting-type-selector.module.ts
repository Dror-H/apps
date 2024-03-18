import { NgModule } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TargetingTypeSelectorComponent } from './targeting-type-selector.component';

@NgModule({
  declarations: [TargetingTypeSelectorComponent],
  exports: [TargetingTypeSelectorComponent],
  imports: [NzFormModule, NzButtonModule, CommonModule, NzBadgeModule, NzToolTipModule],
})
export class TargetingTypeSelectorModule {}
