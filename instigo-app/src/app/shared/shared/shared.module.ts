import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EscapeRegExp } from './escape-regexp.pipe';
import { UiSharedModule } from '@instigo-app/ui/shared';

const components = [EscapeRegExp];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgSelectModule, FormsModule, UiSharedModule],
  exports: [...components],
})
export class SharedModule {}
