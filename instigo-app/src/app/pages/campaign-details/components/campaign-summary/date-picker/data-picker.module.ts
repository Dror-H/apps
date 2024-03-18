import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzInputModule } from 'ng-zorro-antd/input';
import { DatePickerComponent } from './data-picker.component';

@NgModule({
  declarations: [DatePickerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UiSharedModule, NzInputModule],
  exports: [DatePickerComponent],
})
export class DatePickerModule {}
