import { NgModule } from '@angular/core';
import { NewAdTemplateHeaderComponent } from './new-ad-template-header.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [NewAdTemplateHeaderComponent],
  exports: [NewAdTemplateHeaderComponent],
  imports: [NzDropDownModule, CommonModule, ReactiveFormsModule, NzButtonModule, NzRadioModule, FormsModule],
})
export class NewAdTemplateHeaderModule {}
