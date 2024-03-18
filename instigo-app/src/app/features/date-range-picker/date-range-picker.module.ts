import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { DateRangePickerComponent } from './date-range-picker.component';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [CommonModule, NgPipesModule, NzInputModule, FormsModule],
  exports: [DateRangePickerComponent],
})
export class DateRangePickerModule {}
