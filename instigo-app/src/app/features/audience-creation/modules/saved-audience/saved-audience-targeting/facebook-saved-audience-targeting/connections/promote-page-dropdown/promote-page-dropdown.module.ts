import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PromotePageDropdownComponent } from './promote-page-dropdown.component';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [PromotePageDropdownComponent],
  imports: [CommonModule, FormsModule, UiSharedModule, NgSelectModule, NzSelectModule],
  exports: [PromotePageDropdownComponent],
})
export class PromotePageDropdownModule {}
