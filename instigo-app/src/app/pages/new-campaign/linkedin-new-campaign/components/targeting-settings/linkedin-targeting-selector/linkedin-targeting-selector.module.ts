import { NgModule } from '@angular/core';
import { LinkedinTargetingSelectorComponent } from './linkedin-targeting-selector.component';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LinkedinTargetingSelectorComponent],
  imports: [CommonModule, UiSharedModule, NzSelectModule, NzGridModule, NzFormModule, FormsModule],
  exports: [LinkedinTargetingSelectorComponent],
})
export class LinkedinTargetingSelectorModule {}
