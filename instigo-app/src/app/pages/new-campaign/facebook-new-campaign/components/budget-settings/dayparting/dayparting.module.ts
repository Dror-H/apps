import { NgModule } from '@angular/core';
import { DaypartingComponent } from './dayparting.component';
import { NgxSelectoModule } from 'ngx-selecto';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DaypartingComponent],
  exports: [DaypartingComponent],
  imports: [NgxSelectoModule, CommonModule],
})
export class DaypartingModule {}
